import { type User } from "@prisma/client";
import { experimental_taintUniqueValue } from "react";

export type UserDTO = Pick<
  User,
  "id" | "firstName" | "lastName" | "email" | "emailVerified" | "password"
>;

export function filterUser(user: User): UserDTO {
  // Using React's Taint api to make sure passwordHash doesn't leak to the client
  experimental_taintUniqueValue(
    "Do not pass passwordHash to the client.",
    user,
    user.password
  );

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    emailVerified: user.emailVerified,
    password: user.password,
  };
}
