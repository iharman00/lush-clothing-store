import { Stripe } from "stripe";
import { NextRequest, NextResponse } from "next/server";
import {
  CheckoutProduct,
  CheckoutProductSchema,
} from "@/schemas/checkout/CheckoutProductSchema";
import { z, ZodError } from "zod";
import fetchProductVariant from "@/sanity/dynamicQueries/fetchProductVariant";
import { urlFor } from "@/sanity/lib/image";
import { InvalidDataError } from "@/schemas/customErrors";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Types
type Response = {
  success: boolean;
  message: string;
  clientSecret?: string | null;
};

// Helper functions
async function createLineItems(
  products: CheckoutProduct[]
): Promise<Stripe.Checkout.SessionCreateParams.LineItem[]> {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  const fetchPromises = products.map(async (product) => {
    const [variant] = await fetchProductVariant({
      variantId: product.variantId,
      sizeId: product.sizeId,
    });

    lineItems.push({
      price_data: {
        product_data: {
          name: variant.parentProduct.name!,
          description: `Size: ${variant.sizeAndStock[0].size.name} | Color: ${variant.color.name}`,
          images: [urlFor(variant.images![0]).url()],
          metadata: {
            Size: variant.sizeAndStock[0].size.name!,
            Color: variant.color.name!,
          },
        },
        unit_amount: variant.parentProduct.price! * 100,
        currency: "CAD",
      },
      quantity: product.quantity,
      adjustable_quantity: { enabled: true },
    });
  });

  await Promise.all(fetchPromises);
  return lineItems;
}

// Handlers
export async function POST(req: NextRequest): Promise<NextResponse<Response>> {
  try {
    // Validate incoming data
    const body = await req.json();
    const parsedProducts = z.array(CheckoutProductSchema).parse(body);

    // Throw custom error
    if (parsedProducts.length === 0)
      throw new InvalidDataError(
        "Atleast one item is required to initiate checkout"
      );

    // create line items for creating checkout session
    const lineItems = await createLineItems(parsedProducts);

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: lineItems,
      mode: "payment",
      return_url: `${req.headers.get("origin")}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    // Success response with the client secret
    return NextResponse.json({
      success: true,
      message: "Checkout initialized successfully",
      clientSecret: session.client_secret,
    });
  } catch (err) {
    // Zod validation failed
    if (err instanceof ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid data" },
        { status: 400 }
      );
    }

    // Custom error thrown when  there are no items in the request body
    if (err instanceof InvalidDataError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 400 }
      );
    }

    console.error("Stripe Error:", err);
    return NextResponse.json(
      { success: false, message: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details?.email || "No email provided",
    });
  } catch (err) {
    console.error("Stripe Error:", err);
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
