// import "server-only";

import { validateRequest } from "@/auth/middlewares";
import prisma from "@/lib/prisma";
import filterUser, { type UserDTO } from "@/data_access/user/userDTO";

export async function getCurrentUser(): Promise<
  { user: UserDTO } | { user: null }
> {
  const { user: validatedUser } = await validateRequest();

  if (!validatedUser) {
    return { user: null };
  }

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: validatedUser.id,
      },
    });
    return { user: filterUser(user) };
  } catch (e) {
    return { user: null };
  }
}
