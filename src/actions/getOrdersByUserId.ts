"use server";

import { getOrdersByUserId } from "@/data_access/order";
import { getCurrentUser } from "@/data_access/user";
import { OrderItems, Orders } from "@prisma/client";

type OrderWithItems = Orders & {
  orderItems: OrderItems[];
};

export const getOrdersByUserIdAction = async (
  userId: string,
  pageParams: number = 1,
  limit: number = 10
): Promise<{
  data: OrderWithItems[];
  error?: string;
}> => {
  try {
    const user = await getCurrentUser();

    if (!user) throw new Error("User not found");
    if (user.id !== userId) throw new Error("Unauthorized");

    const orders = await getOrdersByUserId(userId, pageParams, limit);
    return { data: orders };
  } catch (err) {
    return { data: [], error: "Failed to fetch orders" };
  }
};
