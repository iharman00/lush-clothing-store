"use client";

import CartItem from "@/components/CartItem";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import fetchProductVariant, {
  fetchProductVariantReturnType,
} from "@/sanity/dynamicQueries/fetchProductVariant";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const page = () => {
  const { items } = useCart();
  const [cartItems, setCartItems] = useState<
    Array<fetchProductVariantReturnType[number] & { quantity: number }>
  >([]);
  const cachedVariants = useRef(new Map()); // Cache fetched variants

  const fetchCartItems = useCallback(async () => {
    if (items.length === 0) {
      setCartItems([]);
      return;
    }

    const newCartItems = [];
    const fetchPromises = [];

    for (const item of items) {
      const cacheKey = `${item.variantId}-${item.variantSizeId}`;
      if (cachedVariants.current.has(cacheKey)) {
        newCartItems.push({
          ...cachedVariants.current.get(cacheKey),
          quantity: item.quantity,
        });
      } else {
        fetchPromises.push(
          fetchProductVariant({
            variantId: item.variantId,
            sizeId: item.variantSizeId,
          }).then(([variant]) => {
            cachedVariants.current.set(cacheKey, variant);
            newCartItems.push({
              ...variant,
              quantity: item.quantity,
            });
          })
        );
      }
    }

    await Promise.all(fetchPromises);
    setCartItems(newCartItems);
  }, [items]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.quantity * item.parentProduct.price!,
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
          <div className="h-full flex flex-col justify-between">
            <div className="flex w-full flex-col pr-6">
              <ScrollArea>
                {cartItems.map((item) => {
                  if (
                    item.images &&
                    item.images[0].alt &&
                    item.parentProduct.name &&
                    item.parentProduct.price &&
                    item.color.name &&
                    item.sizeAndStock[0] &&
                    item.sizeAndStock[0].size.name
                  ) {
                    return (
                      <CartItem
                        key={item._id}
                        item={{
                          _id: item._id,
                          name: item.parentProduct.name,
                          price: item.parentProduct.price,
                          color: item.color.name,
                          size: {
                            _id: item.sizeAndStock[0].size._id,
                            name: item.sizeAndStock[0].size.name,
                          },
                          quantity: item.quantity,
                          image: {
                            _id: item.images[0]._key,
                            url: urlFor(item.images[0]).url(),
                            alt: item.images[0].alt,
                          },
                        }}
                      />
                    );
                  } else {
                    return <div key={item._id}>Sorry</div>;
                  }
                })}
              </ScrollArea>
            </div>
          </div>
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
          <Link
            href="/cart"
            className={buttonVariants({
              className: "w-full",
            })}
          >
            Continue as Guest
          </Link>
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
        </div>
      </div>
    </div>
  );
};

export default page;
