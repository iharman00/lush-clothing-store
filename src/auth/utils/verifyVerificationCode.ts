import "server-only";

import prisma from "@/lib/prisma";
import { type User } from "lucia";
import { isWithinExpirationDate } from "oslo";
import { InvalidOTPError } from "@/auth/schemas/customErrors";

export async function verifyVerificationCode(
  user: User,
  verificationCode: string
): Promise<boolean> {
  const databaseCode = await prisma.emailVerificationCode.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (!databaseCode || databaseCode.code !== verificationCode) {
    throw new InvalidOTPError("Invalid OTP");
  }
  await prisma.emailVerificationCode.delete({
    where: {
      userId: user.id,
      code: verificationCode,
    },
  });

  if (!isWithinExpirationDate(databaseCode.expiresAt)) {
    throw new InvalidOTPError("Invalid OTP");
  }
  if (databaseCode.email !== user.email) {
    throw new InvalidOTPError("Invalid OTP");
  }
  return true;
}
