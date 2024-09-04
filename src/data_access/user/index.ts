import "server-only";

import { z } from "zod";
import { validateRequest } from "@/auth/middlewares";
import prisma from "@/lib/prisma";
import filterUser, { type UserDTO } from "@/data_access/user/userDTO";

const createUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: "First name is required" })
    .max(35, { message: "First name can be at most 35 characters" })
    .toLowerCase(),
  lastName: z
    .string()
    .trim()
    .min(1, { message: "Last name is required" })
    .max(35, { message: "Last name can be at most 35 characters" })
    .toLowerCase(),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email" })
    .toLowerCase(),
  passwordHash: z.string(),
});

type CreateUserType = z.infer<typeof createUserSchema>;

export async function createUser({
  firstName,
  lastName,
  email,
  passwordHash,
}: CreateUserType) {
  // Throws a zod error if validation fails
  createUserSchema.parse({
    firstName,
    lastName,
    email,
    passwordHash,
  });

  // Create user using validated data
  return await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: passwordHash,
    },
  });
}

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

const getUserByEmailSchema = z
  .string()
  .trim()
  .min(1, { message: "Email is required" })
  .email({ message: "Invalid email" })
  .toLowerCase();

type UserEmailType = z.infer<typeof getUserByEmailSchema>;

export async function getUserByEmail(email: UserEmailType) {
  // Throws a zod error if validation fails
  const validatedEmail = getUserByEmailSchema.parse(email);

  return prisma.user.findUniqueOrThrow({
    where: {
      email: validatedEmail,
    },
  });
}

export async function setUserEmailVerified(userId: string, value: boolean) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      emailVerified: value,
    },
  });
}
