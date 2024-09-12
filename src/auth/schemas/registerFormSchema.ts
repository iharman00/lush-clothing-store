import { z } from "zod";
import { userSchemaForValidation } from "@/data_access/user/schemas/userSchemaForValidation";

export const registerFormSchema = userSchemaForValidation
  .extend({
    confirmPassword: z
      .string()
      .min(8, { message: "Please confirm your password" })
      .max(64),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormType = z.infer<typeof registerFormSchema>;
