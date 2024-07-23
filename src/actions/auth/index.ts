"use server";

import { signUpFormSchema, signUpFormType } from "@/lib/definitions";
import { Argon2id } from "oslo/password";
import { lucia } from "@/auth";
import { Prisma, PrismaClient } from "@prisma/client";
import { cookies, headers } from "next/headers";
import { ZodError } from "zod";
import { redirect } from "next/navigation";

interface SignUpActionResult {
  errors: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
}

export async function signUp(
  prevState: any,
  formData: FormData
): Promise<SignUpActionResult> {
  try {
    // 1. Validate fields
    const rawFormData = Object.fromEntries(formData);
    const validatedData = signUpFormSchema.parse(rawFormData);

    // 2. Hash password
    const argon2id = new Argon2id();
    const passwordHash = await argon2id.hash(validatedData.password);

    // 3. Create User
    const prisma = new PrismaClient();
    const user = await prisma.user.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        password: passwordHash,
      },
    });

    // 4. Create Session
    const session = await lucia.createSession(user.id, {});
    // lucia.createSession also creates the session in the database
    const sessionCookie = lucia.createSessionCookie(session.id);

    // 5. Send Session as a cookie
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error) {
    // If its a zod error
    if (error instanceof ZodError) {
      return {
        errors: error.flatten().fieldErrors,
      };
    }

    // If its a prisma error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          errors: {
            email: "A customer with this email already exists",
          },
        };
      }
    }
  }

  // 6. Redirect user
  const referer = headers().get("referer");
  // console.log(referer);
  redirect("/");
}
