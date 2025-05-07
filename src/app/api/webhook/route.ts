import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/data_access/order";
import Stripe from "stripe";
import { CheckoutSessionMetadata, LineItemMetadata } from "../checkout/route";
import { OrderItems, Orders, Prisma } from "@prisma/client";
import { Resend } from "resend";
import { OrderConfirmationEmailTemplate } from "@/lib/email_templates/OrderConfirmationEmailTemplate";
import fetchProductVariant from "@/sanity/dynamicQueries/fetchProductVariant";
import { urlFor } from "@/sanity/lib/image";

const resend = new Resend(process.env.RESEND_API_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: NextRequest): Promise<NextResponse> {
  const signature = req.headers.get("Stripe-Signature");

  if (!signature) {
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  let event;

  try {
    const rawBody = await req.arrayBuffer();
    const buffer = Buffer.from(rawBody);

    event = Stripe.webhooks.constructEvent(buffer, signature, endpointSecret);
  } catch (err) {
    if (err instanceof Error) {
      console.error("Webhook signature verification failed:", err);
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    console.error("Webhook signature verification failed:", err);
    return new NextResponse(`Unknown error occurred: ${err}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      try {
        const session = event.data.object;
        const orderTotal = session.amount_total
          ? session.amount_total / 100
          : 0;
        const customerEmail =
          session.customer_details?.email ?? "cancel@cancel.com";
        const sessionMetadata = session.metadata as CheckoutSessionMetadata;

        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id,
          {
            limit: 100,
          }
        );

        const orderItems = await Promise.all(
          lineItems.data.map(async (item) => {
            try {
              // We will refund and cancel the order if there are any invalid items here
              if (!item.price?.product) return null;

              const priceItem = await stripe.products.retrieve(
                item.price?.product.toString()
              );
              const metadata = priceItem.metadata as LineItemMetadata;

              // Returning null for invalid lineItems
              if (
                !item.price.unit_amount ||
                !item.quantity ||
                !metadata.variantId ||
                !metadata.sizeId
              ) {
                return null;
              }

              const orderItem: NonNullable<
                NonNullable<
                  NonNullable<
                    Prisma.OrdersCreateArgs["data"]["orderItems"]
                  >["createMany"]
                >["data"]
              > = {
                productId: metadata.productId,
                productVariantId: metadata.variantId,
                productSizeId: metadata.sizeId,
                price: item.price.unit_amount / 100,
                quantity: item.quantity,
              };

              return orderItem;
            } catch (error) {
              console.error("Error creating order item", error);
              return null;
            }
          })
        );

        const validOrderItems = orderItems.filter((item) => item !== null); // Filtering out null items

        const order = await createOrder({
          isPaid: true,
          stripe_checkout_session_id: session.id,
          userEmail: customerEmail,
          orderTotal: orderTotal,
          orderItems: {
            createMany: {
              data: validOrderItems,
            },
          },
          // Only connect to the user if userId exists in metadata
          ...(sessionMetadata.existingUserId
            ? {
                user: {
                  connect: {
                    id: sessionMetadata.existingUserId,
                  },
                },
              }
            : {}),
        });

        const createEmailOrderItems = async (
          order: Orders & { orderItems: OrderItems[] }
        ) => {
          try {
            const orderItems = await Promise.all(
              order.orderItems.map(async (item) => {
                try {
                  const [variant] = await fetchProductVariant({
                    productId: item.productId,
                    variantId: item.productVariantId,
                    sizeId: item.productSizeId,
                  });

                  if (!variant) return null;

                  return {
                    _id: variant._id,
                    name: variant.parentProduct?.name || "Unknown Product",
                    color: variant.color?.name || "Unknown Color",
                    size:
                      variant.sizeAndStock?.[0]?.size?.name || "Unknown Size",
                    price: variant.parentProduct?.price || 0,
                    quantity: item.quantity,
                    imageUrl: variant.images?.[0]
                      ? urlFor(variant.images[0]).url()
                      : "/placeholder.jpg",
                  };
                } catch (err) {
                  console.error("Error fetching variant:", err);
                  return null;
                }
              })
            );

            return orderItems.filter((item) => item !== null);
          } catch (error) {
            console.error("Error creating email order items:", error);
            return [];
          }
        };

        const emailOrderItems = await createEmailOrderItems(order);

        await resend.emails.send({
          from: `Lush <${process.env.RESEND_EMAIL}>`,
          to: order.userEmail,
          subject: "Order Confirmation",
          react: OrderConfirmationEmailTemplate({
            orderId: order.id,
            orderItems: emailOrderItems,
            orderTotal: order.orderTotal,
            userEmail: order.userEmail,
          }),
        });
        break;
      } catch (error) {
        console.log(error);
      }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

export const config = {
  api: {
    bodyParser: false, // Required for Stripe webhooks
  },
};
