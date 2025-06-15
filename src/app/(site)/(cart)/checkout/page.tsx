"use client";

import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { CartItem, useCart } from "@/hooks/use-cart";
import { CheckoutProduct } from "@/schemas/checkout/CheckoutProductSchema";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const fetchCheckoutSession = async (checkoutItems: CheckoutProduct[]) => {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(checkoutItems),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch checkout session");
  }

  return response.json();
};

// Transforms cartItems to the format needed by the backend
const cartItemstoCheckoutItems: (cartItems: CartItem[]) => CheckoutProduct[] = (
  cartItems
) =>
  cartItems.map((item) => ({
    productId: item.productId,
    variantId: item.variantId,
    sizeId: item.variantSizeId,
    quantity: item.quantity,
  }));

export default function Page() {
  const cartItems = Object.values(useCart((state) => state.items));
  // Convert cart items to checkout items
  const checkoutItems = cartItemstoCheckoutItems(cartItems);

  const { data, error, isLoading } = useQuery({
    queryKey: ["checkoutSession", checkoutItems],
    queryFn: () => fetchCheckoutSession(checkoutItems),
    enabled: checkoutItems.length > 0, // Prevents the query from running if cart is empty
  });

  const clientSecret = data?.clientSecret;

  if (checkoutItems.length <= 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-1">
        <p className="text-xl font-semibold">Your cart is empty</p>
        <p className="text-sm text-muted-foreground">
          Add items to your cart to checkout
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-40 flex flex-col justify-center items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="text-lg text-foreground">
          One moment while we prepare checkout...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-4">
        <p>Failed to load checkout. Please try again.</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="text-red-500 text-center mt-4">
        <p>Missing checkout session. Please refresh and try again.</p>
      </div>
    );
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <EmbeddedCheckout className="m-4" />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
