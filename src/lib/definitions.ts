import { z } from "zod";

export const signUpFormSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, { message: "First name is required" })
      .max(35, { message: "First name must be at most 35 characters" }),
    lastName: z
      .string()
      .trim()
      .min(1, { message: "Last name is required" })
      .max(35, { message: "Last name must be at most 35 characters" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" })
      .toLowerCase(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(64, { message: "Password must be at most 64 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*d).{8,64}$/, {
        message:
          "Password must include at least one uppercase letter, one lowercase letter, and one number",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Please confirm your password" })
      .max(64),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type signUpFormType = z.infer<typeof signUpFormSchema>;
