import { loginFormSchema, loginFormType } from "@/auth/definitions";
import { Prisma, PrismaClient } from "@prisma/client";
import { Argon2id } from "oslo/password";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { ZodError } from "zod";

const prisma = new PrismaClient();
const argon2id = new Argon2id();

interface UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
}

interface SuccessResponse {
  success: true;
  message: string;
  user: UserDTO;
}

interface ErrorResponse {
  success: false;
  message: string;
  errors: {
    email?: string[];
    password?: string[];
  };
  fields?: any;
}

export async function POST(req: Request) {
  let rawFormData;
  let validatedData: loginFormType;

  try {
    const formData = await req.formData();

    // 1. Validate fields
    rawFormData = Object.fromEntries(formData);
    validatedData = loginFormSchema.parse(rawFormData);

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

    // 6. Send Response with user data
    const response: SuccessResponse = {
      success: true,
      message: "User logged in successfully",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        emailVerified: user.emailVerified,
      },
    };

    return Response.json(response);
  } catch (error) {
    let response: ErrorResponse;

    // If its a javascript error
    if (error instanceof Error) {
      // If formData cannot be read, this error is thrown by Request.formData()
      if (
        error.name === "TypeError" &&
        error.message ===
          "Request.formData: Could not parse content as FormData."
      ) {
        // Generating an empty form fields error object using zod
        const validatedEmptyObject = loginFormSchema.safeParse({});
        const missingFormErrors = validatedEmptyObject.error!;
        response = {
          success: false,
          message: "Log in failed, please send required data",
          errors: missingFormErrors.flatten().fieldErrors,
        };
        return Response.json(response);
      }
    }

    // If its a zod error
    if (error instanceof ZodError) {
      response = {
        success: false,
        message: "Log in failed, please fix form errors",
        errors: error.flatten().fieldErrors,
        fields: rawFormData,
      };
      return Response.json(response, { status: 400 });
    }

    // If its a prisma error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Incorrect email - Record doesn't exist
      if (error.code === "P2025") {
        response = {
          success: false,
          message: "Log in failed",
          errors: {
            email: ["Incorrect email or password"],
            password: ["Incorrect email or password"],
          },
          fields: rawFormData,
        };
        return Response.json(response, { status: 401 });
      }
    }

    // Custom error - thrown when password fails verification
    if (error instanceof Error && error.cause === "Password match failed") {
      response = {
        success: false,
        message: "Log in failed",
        errors: {
          email: ["Incorrect email or password"],
          password: ["Incorrect email or password"],
        },
        fields: rawFormData,
      };
      return Response.json(response, { status: 401 });
    }
  }
}
