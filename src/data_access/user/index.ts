import "server-only";

import { validateRequest } from "@/auth/middlewares";
import prisma from "@/lib/prisma";
import { filterUser } from "@/data_access/user/userDTO";
import { InvalidUserSessionError } from "@/schemas/auth/customErrors";
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
export const getCurrentUser = cache(async () => {
  const { user: validatedUser, session } = await validateRequest();

  // Throw custom error when user or session not available
  if (!validatedUser || !session) {
    throw new InvalidUserSessionError("User not logged in");
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: validatedUser.id,
    },
  });

  return filterUser(user);
});

// provides data for frontend consumption after striping out the password hash
export const getCurrentClientSideUser = async () => {
  const user = await getCurrentUser();

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
