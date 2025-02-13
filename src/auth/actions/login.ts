"use server";

import { loginFormSchema, LoginFormType } from "@/schemas/auth/loginFormSchema";
import { Prisma } from "@prisma/client";
import { verify } from "argon2";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { ZodError } from "zod";
import {
  InvalidDataError,
  PasswordMismatchError,
} from "@/schemas/customErrors";
import { getUserByEmail } from "@/data_access/user";
import prisma from "@/lib/prisma";

type LoginFormArrayType = {
  [Key in keyof LoginFormType]?: LoginFormType[Key][];
};

export type Response = {
  success: boolean;
  message: string;
  errors?: LoginFormArrayType;
  fields?: Partial<LoginFormType>;
};

export default async function login(data: unknown): Promise<Response> {
  let rawFormData;
  let user;
  let response: Response;

  try {
    // 1. Check, extract and validate data
    if (!(data instanceof FormData))
      throw new InvalidDataError(
        "Invalid data, Please send the following fields: email, password as a FormData object."
      );

    rawFormData = Object.fromEntries(data);
    const validatedData = loginFormSchema.parse(rawFormData);

    // 2. Find User
    user = await getUserByEmail({ email: validatedData.email });

    // 3. Verify password
    const validPassword = await verify(user.password, validatedData.password);
    if (!validPassword) {
      throw new PasswordMismatchError("Incorrect password");
    }

    // 4. Create Session in DB
    // check if session already exists
    let session = await prisma.session.findUnique({
      where: { userId: user.id },
    });

    // create a new session if session doesn't exist or isn't valid
    if (!session || !(await lucia.validateSession(session?.id)).session) {
      session = await lucia.createSession(user.id, {});
    }

    const sessionCookie = lucia.createSessionCookie(session.id);

    // 5. Send Session cookie
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    // 6. Send success response
    response = {
      success: true,
      message: "Log in successful",
    };

    return response;
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
    if (error instanceof PasswordMismatchError) {
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
    response = {
      success: false,
      message: "An unexpected error occured",
    };

    return response;
  }
}
