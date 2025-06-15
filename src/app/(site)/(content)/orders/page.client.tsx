"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Orders, OrderItems } from "@prisma/client";

import { UserDTO } from "@/data_access/user/userDTO";
import { getOrdersByUserIdAction } from "@/actions/getOrdersByUserId";
import fetchProductVariant, {
  fetchProductVariantReturnType,
} from "@/sanity/dynamicQueries/fetchProductVariant";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { urlFor } from "@/sanity/lib/image";
import { formatPrice } from "@/lib/utils";

interface OrderCardProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  order: Orders & {
    orderItems: OrderItems[];
  };
}

type ProductVariantWithQuantity = NonNullable<fetchProductVariantReturnType> & {
  quantity: number;
};

const OrderCard = ({ order }: OrderCardProps) => {
  const [items, setItems] = useState<ProductVariantWithQuantity[]>([]);

  useEffect(() => {
    const loadItems = async () => {
      const variants = await Promise.all(
        order.orderItems.map(async (item) => {
          try {
            const variant = await fetchProductVariant({
              productId: item.productId,
              variantId: item.productVariantId,
              sizeId: item.productSizeId,
            });
            return variant ? { ...variant, quantity: item.quantity } : null;
          } catch (err) {
            console.error("Error fetching product variant:", err);
            return null;
          }
        })
      );

      setItems(
        variants.filter((v): v is ProductVariantWithQuantity => v !== null)
      );
    };

    loadItems();
  }, [order]);

  return (
    <Card className="rounded-2xl shadow-md hover:shadow-lg transition">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Order #{order.id}</h3>
            <p className="text-sm text-muted-foreground">
              Ordered on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {items.map((item) => {
            const image = item.variant.images?.[0];
            if (!image) return null;

            return (
              <Image
                key={`${item._id}-${image._key}`}
                src={urlFor(image).url()}
                alt={image.alt || "Product Image"}
                width={1000}
                height={1000}
                className="w-full h-full object-cover rounded-md"
              />
            );
          })}
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={`${item._id}-${item.quantity}`}
              className="flex justify-between text-sm"
            >
              <span>
                {item.name} — {item.variant.color?.name},{" "}
                {item.variant.sizeAndStock?.[0]?.size?.name}
              </span>
              <span>x{item.quantity}</span>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex justify-between items-center text-sm font-medium">
          <span>Total</span>
          <span>{formatPrice(order.orderTotal)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const OrdersClientPage = ({ user }: { user: Omit<UserDTO, "password"> }) => {
  const limit = 5;

  const { data, isLoading, isError, isFetching, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["orders"],
      initialPageParam: 1,
      queryFn: async ({ pageParam }) => {
        try {
          const res = await getOrdersByUserIdAction(user.id, pageParam, limit);
          return { ...res, pageParam };
        } catch (error) {
          console.error("Error fetching orders:", error);
          throw new Error("Failed to fetch orders");
        }
      },
      getNextPageParam: (lastPage) => {
        return lastPage.data.length === limit
          ? lastPage.pageParam + 1
          : undefined;
      },
    });

  if (isError) {
    return (
      <div className="container max-w-4xl py-10">
        <p className="text-red-500">Error fetching orders</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (data?.pages[0].data.length === 0) {
    return <p className="text-lg ml-2">No orders found</p>;
  }

  return (
    <div className="grid gap-6">
      {data?.pages.map((page) =>
        page.data.map((order: Orders & { orderItems: OrderItems[] }) => (
          <OrderCard key={order.id} order={order} />
        ))
      )}
      {hasNextPage && (
        <Button className="mt-10 w-max mx-auto" onClick={() => fetchNextPage()}>
          Load more {isFetching && <LoadingSpinner className="ml-2" />}
        </Button>
      )}
    </div>
  );
};

export default OrdersClientPage;
