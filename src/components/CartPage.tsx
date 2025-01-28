"use client";

import CartItem from "@/components/CartItem";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UserDTO } from "@/data_access/user/userDTO";
import { useCart } from "@/hooks/use-cart";
import getStripe from "@/lib/get-stripe";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { useEffect } from "react";

interface CartPageProps {
  user: Omit<UserDTO, "password"> | null;
}

const stripe = getStripe();

const CartPage = ({ user }: CartPageProps) => {
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);

  const cartItems = Object.values(useCart((state) => state.items));

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.quantity * item.price!,
    0
  );
  const tax = 12;
  const taxAmount = parseFloat(((cartTotal * tax) / 100).toFixed(2));
  const totalWithTax = Math.floor(
    parseFloat((cartTotal + taxAmount).toFixed(2))
  );

  return (
    <div className="container md:px-40 mt-10 grid grid-cols-1 md:grid-cols-3 gap-16">
      <div className="md:col-span-2 flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Cart</h1>
        <Separator />
        {totalItems > 0 ? (
          <ScrollArea className="h-full min-h-[60%]">
            {cartItems.map((item) => {
              if (item.image) {
                return (
                  <CartItem
                    key={`${item.variantId}-${item.variantSizeId}`}
                    item={{
                      _id: item.variantId,
                      name: item.name,
                      price: item.price,
                      color: item.color,
                      size: {
                        _id: item.variantSizeId,
                        name: item.size,
                      },
                      quantity: item.quantity,
                      image: {
                        _id: item.image._id,
                        url: item.image.url,
                        alt: item.image.alt,
                      },
                    }}
                  />
                );
              } else {
                return <div key={item.variantId}>Sorry</div>;
              }
            })}
          </ScrollArea>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <p className="text-xl font-semibold">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">
              Add items to your cart to checkout
            </p>
          </div>
        )}
      </div>
      <div className="md:col-span-1 flex flex-col gap-4">
        <p className="text-xl font-bold">Order Summary</p>
        <Separator />

        <div className="space-y-6">
          <div className="space-y-1.5 text-sm">
            <div className="flex text-muted-foreground">
              <span className="flex-1">Sub Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex text-muted-foreground">
              <span className="flex-1">Shipping Fee</span>
              <span>Free</span>
            </div>
            <div className="flex text-muted-foreground">
              <span className="flex-1">Tax</span>
              <span>{formatPrice(taxAmount)}</span>
            </div>
            <div className="flex">
              <span className="flex-1">Total</span>
              <span>{formatPrice(totalWithTax)}</span>
            </div>
          </div>
          {user ? (
            <form action="/api/checkout">
              <Button
                className={buttonVariants({
                  className: "w-full",
                })}
              >
                Continue
              </Button>
            </form>
          ) : (
            <>
              <form action="/api/checkout">
                <Button
                  className={buttonVariants({
                    className: "w-full",
                  })}
                >
                  Continue as Guest
                </Button>
              </form>
              <div className="relative flex items-center justify-center">
                <Separator className="w-full" />
                <p className="absolute bg-white px-2">or</p>
              </div>
              <Link
                href="/login"
                className={buttonVariants({
                  className: "w-full",
                })}
              >
                Log In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
