import { lucia } from "@/auth";
import { validateRequest } from "@/auth/middlewares";
import { cookies } from "next/headers";

interface SuccessResponse {
  success: true;
  message: string;
}

interface ErrorResponse {
  success: false;
  message: string;
}

export async function GET() {
  const { session } = await validateRequest();
  if (!session) {
    const response: ErrorResponse = {
      success: false,
      message: "Could not log out, user not signed in",
    };
    return Response.json(response, {
      status: 401,
    });
  }

  // Delete session from Database
  await lucia.invalidateSession(session.id);

  // Create and send a blank Session cookie
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  const response: SuccessResponse = {
    success: true,
    message: "Logged out successfully",
  };
  return Response.json(response);
}
