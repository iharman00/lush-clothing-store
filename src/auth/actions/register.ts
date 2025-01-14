"use server";

import {
  registerFormSchema,
  RegisterFormType,
} from "@/schemas/auth/registerFormSchema";
import { Prisma } from "@prisma/client";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { ZodError } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import sendOTPEmail from "@/auth/actions/sendOTPEmail";
import { createUser } from "@/data_access/user";
import { InvalidDataError } from "../../schemas/auth/customErrors";
import { hash } from "argon2";

type RegisterFormArrayType = {
  [Key in keyof RegisterFormType]?: RegisterFormType[Key][];
};

export type Response = {
  success: boolean;
  message: string;
  errors?: RegisterFormArrayType;
  fields?: Partial<RegisterFormType>;
};

export default async function register(data: unknown): Promise<Response> {
  let rawFormData;
  let response: Response;

  try {
    // 1. Check, extract and validate data
    if (!(data instanceof FormData))
      throw new InvalidDataError(
        "Invalid data, Please send the following fields: firstName, lastName, email, password as a FormData object."
      );

    rawFormData = Object.fromEntries(data);
    const validatedData = registerFormSchema.parse(rawFormData);

    // 2. Hash password
    const passwordHash = await hash(validatedData.password);

    // 3. Create User
    const user = await createUser({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      password: passwordHash,
    });

    // 4. Create Session
    const session = await lucia.createSession(user.id, {});
    // lucia.createSession also creates the session in the database
    const sessionCookie = lucia.createSessionCookie(session.id);

    // 5. Send Session cookie
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    // 6. Send verification code to the currently logged in user
    await sendOTPEmail();

    // 7. Redirect user to verify-email
    // This needs to be done outside try catch block because of the way redirect works
  } catch (error) {
    // Custom error - thrown when unexpected data is received
    if (error instanceof InvalidDataError) {
      response = {
        success: false,
        message: error.message,
      };
      return response;
    }

    // If its a zod error
    if (error instanceof ZodError) {
      response = {
        success: false,
        message: "Registration failed",
        errors: error.flatten().fieldErrors,
        fields: rawFormData,
      };
      return response;
    }

    // If its a prisma error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // If user with the email already exists
      if (error.code === "P2002") {
        response = {
          success: false,
          message: "Registration failed",
          errors: {
            email: ["A customer with this email already exists"],
          },
          fields: rawFormData,
        };
        return response;
      }
    }

    response = {
      success: false,
      message: "An unexpected error occured",
    };

    return response;
  }

  revalidatePath("/");
  redirect("/verify-email");
}
