"use server";

import { validateRequest } from "@/auth/middlewares";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  verifyEmailFormSchema,
  verifyEmailFormType,
} from "../definitions/verifyEmail";
import { verifyVerificationCode } from "@/auth/utils/verifyVerificationCode";
import prisma from "@/lib/prisma";
import { ZodError } from "zod";

export type Response = {
  success: boolean;
  message: string;
  errors?: {
    pin?: string[];
  };
  fields?: any;
};

export async function verifyEmail(formData: FormData): Promise<Response> {
  let rawFormData;
  let validatedData: verifyEmailFormType;

  try {
    // 1. Check if user exists
    let { user, session } = await validateRequest();
    if (!user)
      throw new Error("User is not logged In", {
        cause: "Auth failed",
      });

    // 2. Validate fields
    rawFormData = Object.fromEntries(formData);
    validatedData = verifyEmailFormSchema.parse(rawFormData);

    // 3. Validate pin
    const validCode = await verifyVerificationCode(user, validatedData.pin);
    if (!validCode)
      throw new Error("Invalid verification code", { cause: "Invalid code" });

    // 4. Create new session if code is valid
    await lucia.invalidateUserSessions(user.id);

    // 5. Update user's emailVerified to true
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: true,
      },
    });

    // 6. Create Session
    session = await lucia.createSession(user.id, {});
    // lucia.createSession also creates the session in the database
    const sessionCookie = lucia.createSessionCookie(session.id);

    // 7. Send Session cookie
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    // 8. Redirect user to success page
    // This needs to be done outside try catch block because of the way redirect works
  } catch (error) {
    let response: Response;

    // If its a zod error
    if (error instanceof ZodError) {
      response = {
        success: false,
        message: "Verification failed",
        errors: error.flatten().fieldErrors,
        fields: rawFormData,
      };
      return response;
    }

    // Custom error - thrown when user is not logged in
    if (error instanceof Error && error.cause === "Auth failed") {
      response = {
        success: false,
        message: error.message,
        fields: rawFormData,
      };
      return response;
    }

    // Custom error - thrown when code is invalid
    if (error instanceof Error && error.cause === "Invalid code") {
      response = {
        success: false,
        message: error.message,
        errors: {
          pin: ["Invalid code"],
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
  redirect("/email-verified");
}
