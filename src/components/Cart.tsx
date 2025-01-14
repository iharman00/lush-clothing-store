"use client";

import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { cn, formatPrice } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { useCart } from "@/hooks/use-cart";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect, useState } from "react";
import CartItem from "./CartItem";

const Cart = () => {
  const cartItems = Object.values(useCart((state) => state.items));

  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    <Sheet>
      <SheetTrigger className="group flex items-center ">
        <div className={cn(buttonVariants({ variant: "ghost" }), "gap-2")}>
          <div className="relative">
            <ShoppingCart />
            {isMounted && totalItems > 0 && (
              <span className="absolute -top-2 left-1 ml-2 text-sm font-medium text-background bg-secondary-foreground rounded-full w-5 h-5 ">
                {totalItems}
              </span>
            )}
          </div>
          <span className="hidden md:block">Cart</span>
        </div>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Cart ({totalItems})</SheetTitle>
        </SheetHeader>
        {totalItems > 0 ? (
          <>
            <ScrollArea className="h-full min-h-[60%] pr-6">
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
            <div className="space-y-6">
              <Separator />
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
                <div className="flex text-lg pt-2">
                  <span className="flex-1">Total</span>
                  <span>{formatPrice(totalWithTax)}</span>
                </div>
              </div>
              <SheetFooter>
                <SheetTrigger asChild>
                  <Link
                    href="/cart"
                    className={buttonVariants({
                      className: "w-full",
                    })}
                  >
                    Continue to Checkout
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <p className="text-xl font-semibold">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">
              Add items to your cart to checkout
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
