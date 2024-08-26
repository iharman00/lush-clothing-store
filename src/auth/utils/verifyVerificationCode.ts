import prisma from "@/lib/prisma";
import { type User } from "lucia";
import { isWithinExpirationDate } from "oslo";

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
    return false;
  }
  await prisma.emailVerificationCode.delete({
    where: {
      userId: user.id,
      code: verificationCode,
    },
  });

  if (!isWithinExpirationDate(databaseCode.expiresAt)) {
    return false;
  }
  if (databaseCode.email !== user.email) {
    return false;
  }
  return true;
}
