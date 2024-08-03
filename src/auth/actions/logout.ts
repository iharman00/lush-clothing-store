"use server";

import { lucia } from "@/auth";
import { validateRequest } from "@/auth/middlewares";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

interface Response {
  success: false;
  message: string;
  error: string;
}

export async function logout(
  prevState: any,
  formData: FormData
): Promise<Response | null> {
  const { session } = await validateRequest();
  if (!session) {
    const response: Response = {
      success: false,
      message: "Could not log out, user not signed in",
      error: "Not logged in",
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

  redirect("/");
}
