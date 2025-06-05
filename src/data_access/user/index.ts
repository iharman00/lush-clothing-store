import "server-only";

import { validateRequest } from "@/auth/middlewares";
import prisma from "@/lib/prisma";
import { filterUser, UserDTO } from "@/data_access/user/userDTO";
import { User } from "@prisma/client";
import { cache } from "react";

// User data-access function rules
// - purpose of these functions is to control DB data access and mutations
// - these functions are only allowed to run on the server
// - if you need access to data on the client, pass it down as props from a server component
// - functions either return the filtered User Object (UserDto) or throw an error

export const createUser = cache(
  async ({
    firstName,
    lastName,
    email,
    password: passwordHash,
  }: Pick<User, "firstName" | "lastName" | "email" | "password">) => {
    const user = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: passwordHash,
      },
    });

    return filterUser(user);
  }
);

// Return currently logged in userDTO
export const getCurrentUser = cache(async (): Promise<UserDTO | null> => {
  const { user: validatedUser, session } = await validateRequest();

  // Throw custom error when user or session not available
  if (!validatedUser || !session) {
    return null;
  }

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: validatedUser.id,
      },
    });
    return filterUser(user);
  } catch (err) {
    return null;
  }
});

// provides data for frontend consumption after striping out the password hash
export const getCurrentClientSideUser = async (): Promise<Omit<
  UserDTO,
  "password"
> | null> => {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const getUserByEmail = cache(async ({ email }: Pick<User, "email">) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  return filterUser(user);
});

export const setUserEmailVerified = cache(
  async ({ id, emailVerified }: Pick<User, "id" | "emailVerified">) => {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        emailVerified,
      },
    });

    return filterUser(user);
  }
);

export const setUserStripeCustomerId = cache(
  async ({
    id,
    stripe_customer_id,
  }: Pick<User, "id" | "stripe_customer_id">) => {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        stripe_customer_id,
      },
    });

    return filterUser(user);
  }
);
