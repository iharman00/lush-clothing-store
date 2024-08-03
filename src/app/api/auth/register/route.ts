import { registerFormSchema, registerFormType } from "@/auth/definitions";
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
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  fields?: any;
}

export async function POST(req: Request) {
  let rawFormData;
  let validatedData: registerFormType;

  try {
    const formData = await req.formData();

    // 1. Validate fields
    rawFormData = Object.fromEntries(formData);
    validatedData = registerFormSchema.parse(rawFormData);

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

    // 6. Send Response with user data
    const response: SuccessResponse = {
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        emailVerified: user.emailVerified,
      },
    };

    return Response.json(response, { status: 201 });
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
        const validatedEmptyObject = registerFormSchema.safeParse({});
        const missingFormErrors = validatedEmptyObject.error!;
        response = {
          success: false,
          message: "Registration failed, please send required data",
          errors: missingFormErrors.flatten().fieldErrors,
        };
        return Response.json(response);
      }
    }

    // If its a zod error
    if (error instanceof ZodError) {
      response = {
        success: false,
        message: "Registration failed, please fix form errors",
        errors: error.flatten().fieldErrors,
        fields: rawFormData,
      };
      return Response.json(response, { status: 400 });
    }

    // If its a prisma error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // If user with the email already exists
      if (error.code === "P2002") {
        response = {
          success: false,
          message: "Registration failed",
          errors: {
            email: ["A customer with this email already exists"],
          },
          fields: rawFormData,
        };
        return Response.json(response, { status: 409 });
      }
    }

    return Response.json(
      {
        success: false,
        message: "Registration failed, an unexpected error occured",
        fields: rawFormData,
      },
      {
        status: 400,
      }
    );
  }
}
