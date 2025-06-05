"use client";

import { UserDTO } from "@/data_access/user/userDTO";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { OrderItems, Orders } from "@prisma/client";
import fetchProductVariant, {
  fetchProductVariantReturnType,
} from "@/sanity/dynamicQueries/fetchProductVariant";
import React, { useEffect } from "react";
import { getOrdersByUserIdAction } from "@/actions/getOrdersByUserId";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface OrderCardProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  order: Orders & {
    orderItems: OrderItems[];
  };
}

const OrderCard = ({ order }: OrderCardProps) => {
  type ProductVariantWithQuantity = NonNullable<
    fetchProductVariantReturnType[number]
  > & { quantity: number };
  const [items, setItems] = React.useState<ProductVariantWithQuantity[]>([]);

  useEffect(() => {
    const loadItems = async () => {
      const variants = await Promise.all(
        order.orderItems.map(async (item) => {
          try {
            const [variant] = await fetchProductVariant({
              productId: item.productId,
              variantId: item.productVariantId,
              sizeId: item.productSizeId,
            });
            return variant ? { ...variant, quantity: item.quantity } : null;
          } catch {
            return null;
          }
        })
      );
      // Filter out null values
      setItems(variants.filter((v): v is NonNullable<typeof v> => v !== null));
    };

    loadItems();
  }, [order.orderItems]);

  return (
    <Card className="rounded-2xl shadow-md hover:shadow-lg transition">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold ">Order #{order.id}</h3>
            <p className="text-sm text-muted-foreground">
              Ordered placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {items.map((item, index) => {
            if (item.images && item.images[0].alt)
              return (
                <Image
                  key={index}
                  src={urlFor(item.images[0]).url()}
                  alt={item.images[0].alt || "Product Image"}
                  width={1000}
                  height={1000}
                  className="w-full h-full object-cover rounded-md"
                />
              );
          })}
        </div>

        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{item.parentProduct.name}</span>
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
  const limit = 1;
  const { data, isLoading, isError, isFetching, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["orders"],
      initialPageParam: 1,
      queryFn: async ({ pageParam }) => {
        const res = await getOrdersByUserIdAction(user.id, pageParam, limit);
        return { ...res, pageParam };
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
    return <div className="container max-w-4xl py-10">Loading...</div>;
  }

  if (data?.pages[0].data.length === 0) {
    return <p className="text-lg ml-2">No orders found</p>;
  }

  return (
    <div className="grid gap-6">
      {data?.pages.map(
        (order: { data: (Orders & { orderItems: OrderItems[] })[] }) =>
          order.data.map((order: Orders & { orderItems: OrderItems[] }) => (
            <OrderCard key={order.id} order={order} />
          ))
      )}
      {hasNextPage && (
        <Button className="mt-10 w-max mx-auto" onClick={() => fetchNextPage()}>
          Load more {isFetching && <LoadingSpinner />}
        </Button>
      )}
    </div>
  );
};

export default OrdersClientPage;
