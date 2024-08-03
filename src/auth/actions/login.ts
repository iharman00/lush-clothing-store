"use server";

import { loginFormSchema, loginFormType } from "@/auth/definitions";
import { Prisma, PrismaClient } from "@prisma/client";
import { Argon2id } from "oslo/password";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { ZodError } from "zod";

const prisma = new PrismaClient();
const argon2id = new Argon2id();

interface UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
}

interface Response {
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
  fields?: any;
}

export async function login(
  prevState: any,
  formData: FormData
): Promise<Response> {
  let rawFormData;
  let validatedData: loginFormType;

  try {
    // 1. Validate fields
    rawFormData = Object.fromEntries(formData);
    validatedData = loginFormSchema.parse(rawFormData);

    // 2. Find User
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: validatedData.email,
      },
    });

    // 3. Verify password
    const validPassword = await argon2id.verify(
      user!.password,
      validatedData.password
    );

    if (!validPassword) {
      throw new Error("Incorrect email or password", {
        cause: "Password match failed",
      });
    }

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
      message: "Logged in successfully",
    };
    return response;
  } catch (error) {
    let response: Response;

    // If its a zod error
    if (error instanceof ZodError) {
      response = {
        success: false,
        message: "Log in failed",
        errors: error.flatten().fieldErrors,
        fields: rawFormData,
      };
      return response;
    }

    // If its a prisma error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Incorrect email - Record doesn't exist
      if (error.code === "P2025") {
        response = {
          success: false,
          message: "Log in failed",
          errors: {
            email: ["Incorrect email or password"],
            password: ["Incorrect email or password"],
          },
          fields: rawFormData,
        };
        return response;
      }
    }

    // Custom error - thrown when password fails verification
    if (error instanceof Error && error.cause === "Password match failed") {
      response = {
        success: false,
        message: "Log in failed",
        errors: {
          email: ["Incorrect email or password"],
          password: ["Incorrect email or password"],
        },
        fields: rawFormData,
      };
      return response;
    }
  }

  const response: Response = {
    success: false,
    message: "Unexpected error occured",
  };

  return response;
}
