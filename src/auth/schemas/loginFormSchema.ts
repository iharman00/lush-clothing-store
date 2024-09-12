import { userSchemaForValidation } from "@/data_access/user/schemas/userSchemaForValidation";
import { z } from "zod";

export const loginFormSchema = userSchemaForValidation
  .pick({
    email: true,
    // Not using password field to exclude excessive validation checks during login
  })
  .extend({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(64, { message: "Password can be at most 64 characters" }),
  });

export type LoginFormType = z.infer<typeof loginFormSchema>;
