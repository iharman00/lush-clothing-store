import { z } from "zod";

// Important notes
// - Only use this schema to validate user input
// - for eg. Register or log in user
// - DO NOT use this schema to type the response from a database query

export const userSchemaForValidation = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: "First name is required" })
    .max(35, { message: "First name can be at most 35 characters" })
    .toLowerCase(),
  lastName: z
    .string()
    .trim()
    .min(1, { message: "Last name is required" })
    .max(35, { message: "Last name can be at most 35 characters" })
    .toLowerCase(),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .max(320, { message: "Email can be at most 320 characters" })
    .email({ message: "Invalid email" })
    .toLowerCase(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(64, { message: "Password can be at most 64 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message:
        "Password must include at least one uppercase letter, one lowercase letter, and one number",
    }),
});
