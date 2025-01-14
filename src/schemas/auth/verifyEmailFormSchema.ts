import { z } from "zod";

export const verifyEmailFormSchema = z.object({
  pin: z
    .string()
    .length(6, { message: "Verification Code must be 6 characters long" }),
});

export type VerifyEmailFormType = z.infer<typeof verifyEmailFormSchema>;
