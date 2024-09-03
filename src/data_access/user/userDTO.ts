import { User } from "@prisma/client";

export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
};

export default function filterUser(user: User): UserDTO {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    emailVerified: user.emailVerified,
  };
}
