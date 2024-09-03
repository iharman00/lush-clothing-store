"use server";

import { validateRequest } from "@/auth/middlewares";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  verifyEmailFormSchema,
  VerifyEmailFormType,
} from "@/auth/definitions/verifyEmail";
import { verifyVerificationCode } from "@/auth/utils/verifyVerificationCode";
import prisma from "@/lib/prisma";
import { ZodError } from "zod";
import {
  InvalidOTPError,
  InvalidUserSessionError,
} from "@/auth/definitions/customErrors";

type VerifyEmailFormArrayType = {
  [Key in keyof VerifyEmailFormType]?: VerifyEmailFormType[Key][];
};

export type Response = {
  success: boolean;
  message: string;
  errors?: VerifyEmailFormArrayType;
  fields?: Partial<VerifyEmailFormType>;
};

export default async function verifyEmail(
  formData: FormData
): Promise<Response> {
  let rawFormData;
  let validatedData: VerifyEmailFormType;

  try {
    // 1. Check if user exists
    let { user, session } = await validateRequest();
    if (!user) throw new InvalidUserSessionError("User is not logged in");

    // 2. Validate fields
    rawFormData = Object.fromEntries(formData);
    validatedData = verifyEmailFormSchema.parse(rawFormData);

    // 3. Validate pin
    // Throws InvalidOTPError if verification fails
    await verifyVerificationCode(user, validatedData.pin);

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
    if (error instanceof InvalidUserSessionError) {
      response = {
        success: false,
        message: error.message,
        fields: rawFormData,
      };
      return response;
    }

    // Custom error - thrown when code is invalid
    if (error instanceof InvalidOTPError) {
      response = {
        success: false,
        message: "Invalid OTP",
        errors: {
          pin: ["Invalid OTP"],
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
  revalidatePath("/");
  redirect("/email-verified");
}
