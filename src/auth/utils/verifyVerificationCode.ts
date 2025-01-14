import "server-only";

import prisma from "@/lib/prisma";
import { type User } from "lucia";
import { isWithinExpirationDate } from "oslo";
import { OTPVerificationError } from "@/schemas/auth/customErrors";

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
    throw new OTPVerificationError("Invalid OTP");
  }
  await prisma.emailVerificationCode.delete({
    where: {
      userId: user.id,
      code: verificationCode,
    },
  });

  if (!isWithinExpirationDate(databaseCode.expiresAt)) {
    throw new OTPVerificationError("Invalid OTP");
  }
  if (databaseCode.email !== user.email) {
    throw new OTPVerificationError("Invalid OTP");
  }
  return true;
}
