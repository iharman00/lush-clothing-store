"use server";

import { getCurrentUser } from "@/data_access/user";
import sendVerificationCode from "@/auth/utils/sendVerificationCode";
import { InvalidUserSessionError } from "@/auth/schemas/customErrors";

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
    await sendVerificationCode(currentUser);

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

    response = {
      success: false,
      message: "An unexpected error occured",
    };

    return response;
  }
}
