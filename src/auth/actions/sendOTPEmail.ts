"use server";

import { getCurrentUser } from "@/data_access/user";
import sendVerificationCode from "@/auth/utils/sendVerificationCode";
import { InvalidUserSessionError } from "@/auth/definitions/customErrors";

export type Response = {
  success: boolean;
  message: string;
};

export default async function sendOTPEmail(): Promise<Response> {
  let response: Response;
  try {
    // 1. Validate Request and find the user
    const { user: validatedUser } = await getCurrentUser();
    if (!validatedUser)
      throw new InvalidUserSessionError("User is not logged in");

    // 2. Send Verification code
    const res = await sendVerificationCode(validatedUser);

    response = {
      success: true,
      message: `Successfully sent OTP to ${validatedUser.email}`,
    };

    return response;
  } catch (error) {
    // Custom error instance - thrown when user is not signed in
    if (error instanceof InvalidUserSessionError) {
      response = {
        success: false,
        message: error.message,
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
