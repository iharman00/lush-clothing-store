"use server";

import { getCurrentUser } from "@/data_access/user";
import sendVerificationCode from "@/auth/utils/sendVerificationCode";
import {
  InvalidOTPRequestError,
  InvalidUserSessionError,
} from "@/auth/schemas/customErrors";

export type Response = {
  success: boolean;
  message: string;
};

export default async function sendOTPEmail(): Promise<Response> {
  let response: Response;
  try {
    // 1. Validate Request and find the user
    // This throws InvalidUserSessionError if user doesn't exist
    const currentUser = await getCurrentUser();

    // 2. Send Verification code
    if (currentUser.emailVerified)
      throw new InvalidOTPRequestError("User's email is already verified.");
    if (!currentUser.emailVerified) await sendVerificationCode(currentUser);

    response = {
      success: true,
      message: `Successfully sent OTP to ${currentUser.email}`,
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

    // Custom error instance - thrown when user's email is already verified
    if (error instanceof InvalidOTPRequestError) {
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
