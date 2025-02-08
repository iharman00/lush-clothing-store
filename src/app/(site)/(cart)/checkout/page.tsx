"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useCart } from "@/hooks/use-cart";
import { CheckoutProduct } from "@/schemas/checkout/CheckoutProductSchema";
import { Loader2 } from "lucide-react";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing");
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function Page() {
  const cartItems = Object.values(useCart((state) => state.items));
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Convert cart items to checkout items
  const checkoutItems: CheckoutProduct[] = cartItems.map((item) => ({
    variantId: item.variantId,
    sizeId: item.variantSizeId,
    quantity: item.quantity,
  }));

  // Initialize checkout on component mount or when cart changes
  useEffect(() => {
    if (cartItems.length === 0 || clientSecret) return;

    const initializeCheckout = async () => {
      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(checkoutItems),
        });
        const data = await response.json();

        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          console.error("Failed to get client secret:", data);
        }
      } catch (error) {
        console.error("Error initializing checkout:", error);
      }
    };

    initializeCheckout();
  }, [cartItems, checkoutItems]);

  // Only render checkout when we have a client secret
  if (!clientSecret) {
    return (
      <div className="mt-40 flex flex-col justify-center items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="text-lg text-foreground">
          One moment while we prepare checkout
        </p>
      </div>
    );
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
