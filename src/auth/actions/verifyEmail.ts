"use server";

import { validateRequest } from "@/auth/middlewares";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import {
  verifyEmailFormSchema,
  VerifyEmailFormType,
} from "@/schemas/auth/verifyEmailFormSchema";
import { verifyVerificationCode } from "@/auth/utils/verifyVerificationCode";
import { ZodError } from "zod";
import {
  InvalidDataError,
  OTPVerificationError,
  InvalidUserSessionError,
} from "@/schemas/customErrors";
import {
  getCurrentUser,
  setUserEmailVerified,
  setUserStripeCustomerId,
} from "@/data_access/user";
import Stripe from "stripe";

type VerifyEmailFormArrayType = {
  [Key in keyof VerifyEmailFormType]?: VerifyEmailFormType[Key][];
};

export type Response = {
  success: boolean;
  message: string;
  errors?: VerifyEmailFormArrayType;
  fields?: Partial<VerifyEmailFormType>;
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function verifyEmail(data: unknown): Promise<Response> {
  let rawFormData;
  let validatedData: VerifyEmailFormType;
  let response: Response;

  try {
    // 1. Check if user exists
    let user = await getCurrentUser();
    if (!user) throw new InvalidUserSessionError("User is not logged in");

    // 2. Check, extract and validate data
    if (!(data instanceof FormData))
      throw new InvalidDataError(
        "Invalid data, Please send the following field: PIN (One time password) as a FormData object."
      );

    rawFormData = Object.fromEntries(data);
    validatedData = verifyEmailFormSchema.parse(rawFormData);

    // 3. Validate pin
    // Throws InvalidOTPError if verification fails
    await verifyVerificationCode(
      { id: user.id, email: user.email },
      validatedData.pin
    );

    // 4. Create customer on stripe
    if (!user.stripe_customer_id) {
      const stripeCustomer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      });
      await setUserStripeCustomerId({
        id: user.id,
        stripe_customer_id: stripeCustomer.id,
      });
    }

    // 4. Create new session if code is valid
    await lucia.invalidateUserSessions(user.id);

    // 5. Update user's details
    await setUserEmailVerified({ id: user.id, emailVerified: true });

    // 6. Create Session
    const session = await lucia.createSession(user.id, {});
    // lucia.createSession also creates the session in the database
    const sessionCookie = lucia.createSessionCookie(session.id);

    // 7. Send Session cookie
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    // 8. Send success response
    response = {
      success: true,
      message: "Email verified successfully",
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

    // Custom error - thrown when OTP is invalid
    if (error instanceof OTPVerificationError) {
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
}
