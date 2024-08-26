import { PrismaClient, User } from "@prisma/client";
import { validateRequest } from "@/auth/middlewares";

const prisma = new PrismaClient();

export async function getUser(): Promise<{ user: User } | { user: null }> {
  const { user: validatedUser } = await validateRequest();
  if (!validatedUser) {
    return { user: null };
  }
  const user = await prisma.user.findUnique({
    where: {
      id: validatedUser.id,
    },
  });
  return { user };
}
