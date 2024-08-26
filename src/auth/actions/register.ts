"use server";

import {
  registerFormSchema,
  registerFormType,
} from "@/auth/definitions/registerForm";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { hash } from "argon2";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { ZodError } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import sendVerificationCode from "../utils/sendVerificationCode";

type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
};

export type Response = {
  success: boolean;
  message: string;
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  fields?: any;
};

export async function register(formData: FormData): Promise<Response> {
  let rawFormData;
  let validatedData: registerFormType;
  let response: Response;

  try {
    // 1. Validate fields
    rawFormData = Object.fromEntries(formData);
    validatedData = registerFormSchema.parse(rawFormData);

    // 2. Hash password
    const passwordHash = await hash(validatedData.password);

    // 3. Create User
    const user = await prisma.user.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        password: passwordHash,
      },
    });

    // 4. Send verification code
    const res = await sendVerificationCode(user);

    // 5. Create Session
    const session = await lucia.createSession(user.id, {});
    // lucia.createSession also creates the session in the database
    const sessionCookie = lucia.createSessionCookie(session.id);

    // 6. Send Session cookie
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    // 7. Redirect user to verify-email
    // This needs to be done outside try catch block because of the way redirect works
  } catch (error) {
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
      message: "Unexpected error occured",
    };

    return response;
  }

  revalidatePath("/");
  redirect("/verify-email");
}