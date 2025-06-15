import "server-only";

import generateEmailVerificationCode from "@/auth/utils/generateEmailVerificationCode";
import { VerifyEmailTemplate } from "./VerifyEmailTemplate";
import { Resend } from "resend";
import { UserDTO } from "@/data_access/user/userDTO";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendVerificationCode(user: UserDTO) {
  const verificationCode = await generateEmailVerificationCode(
    user.id,
    user.email
  );
  const verificationEmail = VerifyEmailTemplate({ verificationCode });

  return await resend.emails.send({
    from: `Lush <${process.env.RESEND_EMAIL}>`,
    to: user.email,
    subject: "Email Verification Code",
    react: verificationEmail,
  });
}
