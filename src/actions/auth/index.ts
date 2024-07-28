"use server";

import { loginFormSchema, registerFormSchema } from "@/lib/definitions";
import { Argon2id } from "oslo/password";
import { lucia } from "@/auth";
import { Prisma, PrismaClient } from "@prisma/client";
import { cookies, headers } from "next/headers";
import { ZodError } from "zod";
import { redirect } from "next/navigation";
import { validateRequest } from "@/auth/middlewares";

const prisma = new PrismaClient();
const argon2id = new Argon2id();

interface registerActionResult {
  errors: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
}

export async function register(
  prevState: any,
  formData: FormData
): Promise<registerActionResult> {
  try {
    // 1. Validate fields
    const rawFormData = Object.fromEntries(formData);
    const validatedData = registerFormSchema.parse(rawFormData);

    // 2. Hash password
    const passwordHash = await argon2id.hash(validatedData.password);

    // 3. Create User
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

    // 5. Send Session cookie
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
      // Record already exists
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
  return redirect("/");
}

interface loginActionResult {
  errors: {
    email?: string;
    password?: string;
  };
}

export async function login(
  prevState: any,
  formData: FormData
): Promise<loginActionResult> {
  try {
    // 1. Validate fields
    const rawFormData = Object.fromEntries(formData);
    const validatedData = loginFormSchema.parse(rawFormData);

    // 2. Find User
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: validatedData.email,
      },
    });

    // 3. Verify password
    const validPassword = await argon2id.verify(
      user!.password,
      validatedData.password
    );

    if (!validPassword) {
      throw new Error("Incorrect email or password", {
        cause: "Password match failed",
      });
    }

    // 4. Create Session
    const session = await lucia.createSession(user.id, {});
    // lucia.createSession also creates the session in the database
    const sessionCookie = lucia.createSessionCookie(session.id);

    // 5. Send Session cookie
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
      // Incorrect email - Record doesn't exist
      if (error.code === "P2025") {
        return {
          errors: {
            email: "Incorrect email or password",
            password: "Incorrect email or password",
          },
        };
      }
    }

    // Custom error - thrown when password fails verification
    if (error instanceof Error && error.cause === "Password match failed") {
      return {
        errors: {
          email: "Incorrect email or password",
          password: "Incorrect email or password",
        },
      };
    }
  }

  // 6. Redirect user
  const referer = headers().get("referer");
  // console.log(referer);
  return redirect("/");
}

interface logoutActionResult {
  error: string;
}

export async function logout(): Promise<logoutActionResult> {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
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

  return redirect("/login");
}
