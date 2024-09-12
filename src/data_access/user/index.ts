import "server-only";

import { validateRequest } from "@/auth/middlewares";
import prisma from "@/lib/prisma";
import { filterUser } from "@/data_access/user/userDTO";
import { InvalidUserSessionError } from "@/auth/schemas/customErrors";
import { User } from "@prisma/client";

// User data-access function rules
// - purpose of these functions is to control what data is transfered to the rest of the app
// - data access functions are only allowed to run on the server
// - if you need access on the client side pass it down as props from a server component
// - functions either return the filtered User Object (UserDto) or throw an error

export async function createUser({
  firstName,
  lastName,
  email,
  password: passwordHash,
}: Pick<User, "firstName" | "lastName" | "email" | "password">) {
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

// Return currently logged in userDTO
export async function getCurrentUser() {
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
}

// provides data for frontend consumption, therefore striping out password
export async function getCurrentClientSideUser() {
  const user = await getCurrentUser();

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
}

export async function getUserByEmail({ email }: Pick<User, "email">) {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  return filterUser(user);
}

export async function setUserEmailVerified({
  id,
  emailVerified,
}: Pick<User, "id" | "emailVerified">) {
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
