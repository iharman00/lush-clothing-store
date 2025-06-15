export const dynamic = "force-dynamic";

import { Stripe } from "stripe";
import { NextRequest, NextResponse } from "next/server";
import {
  CheckoutProduct,
  CheckoutProductSchema,
} from "@/schemas/checkout/CheckoutProductSchema";
import { z, ZodError } from "zod";
import fetchProductVariant, {
  fetchProductVariantReturnType,
} from "@/sanity/dynamicQueries/fetchProductVariant";
import { urlFor } from "@/sanity/lib/image";
import {
  InvalidAuthorizationError,
  InvalidDataError,
} from "@/schemas/customErrors";
import { validateRequest } from "@/auth/middlewares";
import { getOrder } from "@/data_access/order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Types
type Response = {
  success: boolean;
  message: string;
  clientSecret?: string | null;
};

export type LineItemMetadata = {
  productId: string;
  variantId: string;
  sizeId: string;
};

export type CheckoutSessionMetadata = {
  existingUserId: string | null;
};

type ProductVariantType = fetchProductVariantReturnType & {
  quantity: number;
  sizeId: string;
};

// Helper functions
// Fetches live product data from sanity and adds some additional properties
async function fetchProductVariants(
  products: CheckoutProduct[]
): Promise<ProductVariantType[]> {
  const fetchedProducts = await Promise.all(
    products.map(async (product) => {
      const variant = await fetchProductVariant({
        productId: product.productId,
        variantId: product.variantId,
        sizeId: product.sizeId,
      });

      if (variant) {
        return {
          ...variant,
          quantity: product.quantity,
          sizeId: product.sizeId,
        } as ProductVariantType;
      }
      return null;
    })
  );

  // Filter out any null values if some products didn't have variants
  return fetchedProducts.filter((product) => product !== null);
}

async function createLineItems(
  products: ProductVariantType[]
): Promise<Stripe.Checkout.SessionCreateParams.LineItem[]> {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((item) => {
    const metadata: LineItemMetadata = {
      productId: item._id,
      variantId: item.variants[0]._key,
      sizeId: item.sizeId,
    };
    lineItems.push({
      price_data: {
        product_data: {
          name: item.name!,
          description: `Size: ${item.variants[0].sizeAndStock[0].size.name} | Color: ${item.variants[0].color.name}`,
          images: [urlFor(item.variants[0].images![0]).url()],
          metadata: metadata,
        },
        unit_amount: item.price * 100,
        currency: "CAD",
      },
      quantity: item.quantity,
      adjustable_quantity: { enabled: true },
    });
  });

  return lineItems;
}

export async function POST(req: NextRequest): Promise<NextResponse<Response>> {
  try {
    // Validate incoming data
    const body = await req.json();
    const parsedProducts = z.array(CheckoutProductSchema).parse(body);

    // If user is logged in, make sure their email is verified before proceeding
    const { user } = await validateRequest();
    if (user && !user.emailVerified) {
      throw new InvalidAuthorizationError("User email is not verified");
    }

    // Throw custom error
    if (parsedProducts.length === 0)
      throw new InvalidDataError(
        "Atleast one item is required to initiate checkout"
      );

    // Fetch product variants from Sanity CMS
    const fetchedProducts = await fetchProductVariants(parsedProducts);

    // create line items for creating checkout session
    const lineItems = await createLineItems(fetchedProducts);

    const sessionMetadata: CheckoutSessionMetadata = {
      existingUserId: user?.id ? user.id : null,
    };

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: lineItems,
      mode: "payment",
      // Add customer stripe id if user is logged in and email is verified
      ...(user && user.emailVerified && user.stripe_customer_id
        ? { customer: user.stripe_customer_id }
        : {}),
      return_url: `${req.headers.get("origin")}/checkout/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      metadata: sessionMetadata,
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
    if (err instanceof InvalidAuthorizationError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 403 }
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
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    const order = await getOrder(sessionId);

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      isPaid: order.isPaid,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
