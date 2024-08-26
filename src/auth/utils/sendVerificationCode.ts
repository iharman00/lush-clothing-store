"use server";

import generateEmailVerificationCode from "@/auth/utils/generateEmailVerificationCode";
import { EmailTemplate } from "./VerificationEmailTemplate";
import { Resend } from "resend";
import { type User } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendVerificationCode(user: User) {
  const verificationCode = await generateEmailVerificationCode(
    user.id,
    user.email
  );
  return await resend.emails.send({
    from: `Lush <${process.env.RESEND_EMAIL}>`,
    to: user.email,
    subject: "Email Verification Code",
    react: EmailTemplate({ verificationCode }),
  });
}
