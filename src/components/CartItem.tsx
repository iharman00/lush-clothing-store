"use client";

import { type CartItem, useCart } from "@/hooks/use-cart";
import { cn, formatPrice } from "@/lib/utils";
import Image from "next/image";
import { Button, buttonVariants } from "./ui/button";
import { Separator } from "./ui/separator";

interface CartIem {
  item: {
    _id: string;
    name: string;
    color: string;
    size: { _id: string; name: string };
    price: number;
    quantity: number;
    image: {
      _id: string;
      url: string;
      alt: string;
    };
  };
}

const CartItem = ({ item }: CartIem) => {
  const { deleteItem, addItem, removeItem } = useCart();

  return (
    <div className="grid grid-cols-3 grid-rows-1 gap-6 my-6 h-40">
      <div className="col-span-1">
        {item.image && item.image.alt && (
          <Image
            src={item.image.url}
            alt={item.image.alt}
            width={1000}
            height={1000}
            className="w-full h-full object-cover object-top"
          />
        )}
      </div>
      {/* Item Details */}
      <div className="col-span-2 flex justify-between">
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-foreground">{item.name}</p>
            <div className="flex gap-4 my-2">
              <p className="text-muted-foreground text-sm">{item.color}</p>
              <Separator orientation="vertical" className="h-5" />
              <p className="text-muted-foreground text-sm">{item.size.name}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm">Quantity: </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  removeItem({
                    variantId: item._id,
                    variantSizeId: item.size._id,
                    quantity: 1,
                  })
                }
              >
                -
              </Button>
              <p
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "hover:bg-background"
                )}
              >
                {item.quantity}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  addItem({
                    variantId: item._id,
                    variantSizeId: item.size._id,
                    quantity: 1,
                  })
                }
              >
                +
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between text-right">
          <div>
            <p className="text-foreground">{formatPrice(item.price)}</p>
            {item.quantity > 1 && (
              <p className="text-muted-foreground mt-1">
                {formatPrice(item.price * item.quantity)}
              </p>
            )}
          </div>
          <Button
            variant={"link"}
            className="px-0 text-muted-foreground text-sm"
            onClick={() =>
              deleteItem({ variantId: item._id, variantSizeId: item.size._id })
            }
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
