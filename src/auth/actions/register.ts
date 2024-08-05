"use server";

import { registerFormSchema, registerFormType } from "@/auth/definitions";
import { Prisma, PrismaClient } from "@prisma/client";
import { Argon2id } from "oslo/password";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { ZodError } from "zod";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();
const argon2id = new Argon2id();

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

  try {
    // 1. Validate fields
    rawFormData = Object.fromEntries(formData);
    validatedData = registerFormSchema.parse(rawFormData);

    // 2. Hash password
    const passwordHash = await argon2id.hash(validatedData.password);

    // 3. Create User
    const user = await prisma.user.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        password: passwordHash,
      },
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

    // 6. Returns success message to user
    const response: Response = {
      success: true,
      message: "User Registered successfully",
    };
    return response;
  } catch (error) {
    let response: Response;

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
  }

  const response: Response = {
    success: false,
    message: "Unexpected error occured",
  };

  return response;
}
