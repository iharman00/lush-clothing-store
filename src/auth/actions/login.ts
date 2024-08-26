"use server";

import { loginFormSchema, loginFormType } from "@/auth/definitions/loginForm";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { verify } from "argon2";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { ZodError } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import sendVerificationCode from "@/auth/utils/sendVerificationCode";

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
    email?: string[];
    password?: string[];
  };
  fields?: any;
};

export async function login(formData: FormData): Promise<Response> {
  let rawFormData;
  let validatedData: loginFormType;
  let user;

  try {
    // 1. Validate fields
    rawFormData = Object.fromEntries(formData);
    validatedData = loginFormSchema.parse(rawFormData);

    // 2. Find User
    user = await prisma.user.findUniqueOrThrow({
      where: {
        email: validatedData.email,
      },
    });

    // 3. Verify password
    const validPassword = await verify(user!.password, validatedData.password);

    if (!validPassword) {
      throw new Error("Log in failed", {
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

    // 6. Send verification code id email is not verified
    if (!user.emailVerified) {
      const res = await sendVerificationCode(user);
    }

    // 6. Redirect user to homepage or verify-email page
    // This needs to be done outside try catch block because of the way redirect works
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
        message: error.message,
        errors: {
          email: ["Incorrect email or password"],
          password: ["Incorrect email or password"],
        },
        fields: rawFormData,
      };
      return response;
    }

    response = {
      success: false,
      message: "Unexpected error occured",
    };

    return response;
  }

  revalidatePath("/");
  if (!user.emailVerified) {
    redirect("/verify-email");
  }
  redirect("/");
}
