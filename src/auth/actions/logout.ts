"use server";

import { lucia } from "@/auth";
import { validateRequest } from "@/auth/middlewares";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

type Response = {
  success: boolean;
  message: string;
};

export default async function logout(): Promise<Response> {
  const { session } = await validateRequest();
  if (!session) {
    const response: Response = {
      success: false,
      message: "Could not log out",
    };
    return response;
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

  const response: Response = {
    success: true,
    message: "Logged out successfully",
  };

  return response;
}
