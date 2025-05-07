import "server-only";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type createOrderProps = Omit<
  Prisma.OrdersCreateInput,
  "id" | "createdAt"
>;

export async function createOrder(orderDetails: createOrderProps) {
  return prisma.orders.create({
    data: {
      isPaid: orderDetails.isPaid,
      stripe_checkout_session_id: orderDetails.stripe_checkout_session_id,
      userEmail: orderDetails.userEmail,
      orderTotal: orderDetails.orderTotal,
      userId: orderDetails.user?.connect?.id,
      ...(orderDetails.orderItems?.createMany?.data
        ? {
            orderItems: {
              createMany: {
                data: orderDetails.orderItems?.createMany?.data,
              },
            },
          }
        : {}),
    },
    include: {
      orderItems: true,
    },
  });
}

export async function getOrder(session_id: string) {
  return prisma.orders.findUnique({
    where: { stripe_checkout_session_id: session_id },
    include: { orderItems: true },
  });
}

export async function getOrdersByUserId(
  userId: string,
  pageParams: number = 1,
  limit: number = 10
) {
  // Pagination logic
  const skip = (pageParams - 1) * limit;
  return prisma.orders.findMany({
    where: { userId },
    include: { orderItems: true },
    skip,
    take: limit,
  });
}
