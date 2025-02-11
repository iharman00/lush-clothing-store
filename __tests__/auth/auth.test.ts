import { describe, test, expect, vi, beforeEach, beforeAll } from "vitest";
import { lucia } from "@/auth";
import prisma from "../helpers/prisma";
import resetDb from "../helpers/reset-db";
import { verify } from "argon2";
import register from "@/auth/actions/register";
import { RegisterFormType } from "@/schemas/auth/registerFormSchema";
import login from "@/auth/actions/login";
import { LoginFormType } from "@/schemas/auth/loginFormSchema";
import logout from "@/auth/actions/logout";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { validateRequest } from "@/auth/middlewares";

vi.mock("@/auth/actions/sendOTPEmail", () => ({
  default: vi.fn(),
}));

const getCookieMock = vi.fn();
const setCookieMock = vi.fn();

vi.mock("next/headers", () => ({
  cookies: () => ({ set: setCookieMock, get: getCookieMock }),
}));

// Helper method to generate FormData from objects since our actions require FormData
function objectToFormData(obj: Record<string, any>): FormData {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return formData;
}

describe("Auth", () => {
  describe("Register", () => {
    beforeEach(async () => {
      try {
        await resetDb();
      } catch (error) {
        console.log(error);
      }
    });

    test("should register a new user successfully", async () => {
      const user: RegisterFormType = {
        firstName: "Test user",
        lastName: "Test user",
        email: "test@mail.com",
        password: "Testpassword123",
        confirmPassword: "Testpassword123",
      };

      const formData = objectToFormData(user);
      const result = await register(formData);

      const dbUser = await prisma.user.findFirst({
        where: { email: user.email },
      });
      expect(dbUser).toBeDefined();

      // register() calls redirect, so no return value
      expect(result).toBeUndefined();
    });

    test("should fail for invalid form data", async () => {
      const user = { email: "not-an-email" };
      const invalidFormData = objectToFormData(user);

      const result = await register(invalidFormData);

      const dbUser = await prisma.user.findFirst({
        where: { email: user.email },
      });
      expect(dbUser).toBeNull();

      expect(result?.success).toBe(false);
    });

    test("should fail if a user already exists", async () => {
      const user: RegisterFormType = {
        firstName: "Test user",
        lastName: "Test user",
        email: "test@mail.com",
        password: "Testpassword123",
        confirmPassword: "Testpassword123",
      };
      const formData = objectToFormData(user);

      await register(formData);

      // Try to register again
      const result = await register(formData);

      expect(result?.success).toBe(false);
    });
    test("should hash user's password before saving it to the database", async () => {
      const user: RegisterFormType = {
        firstName: "Test user",
        lastName: "Test user",
        email: "test@mail.com",
        password: "Testpassword123",
        confirmPassword: "Testpassword123",
      };
      const formData = objectToFormData(user);

      const result = await register(formData);
      const dbUser = await prisma.user.findFirst({
        where: { email: user.email },
      });

      expect(result).toBeUndefined();
      expect(dbUser).toBeDefined();
      const isHashed = await verify(dbUser!.password, user.password);
      expect(isHashed).toBe(true);
    });
    test("should create a session in DB after successfull user registration", async () => {
      const user: RegisterFormType = {
        firstName: "Test user",
        lastName: "Test user",
        email: "test@mail.com",
        password: "Testpassword123",
        confirmPassword: "Testpassword123",
      };
      const formData = objectToFormData(user);

      const result = await register(formData);
      const dbUser = await prisma.user.findFirst({
        where: { email: user.email },
        include: { sessions: true },
      });

      expect(result).toBeUndefined();
      expect(dbUser).toBeDefined();
      expect(dbUser!.sessions).toHaveLength(1);
    });
  });
  describe("Login", () => {
    const registereduser: RegisterFormType = {
      firstName: "Test user",
      lastName: "Test user",
      email: "test@mail.com",
      password: "Testpassword123",
      confirmPassword: "Testpassword123",
    };
    const formData = objectToFormData(registereduser);

    beforeAll(async () => {
      try {
        await resetDb();
        await register(formData);
      } catch (error) {
        console.log(error);
      }
    });

    test("should login a user successfully", async () => {
      const userDetails: LoginFormType = {
        email: registereduser.email,
        password: registereduser.password,
      };
      const formData = objectToFormData(userDetails);

      const result = await login(formData);

      // login() calls redirect, so no return value
      expect(result).toBeUndefined();
    });
    test("should fail if password is wrong", async () => {
      const userDetails: LoginFormType = {
        email: registereduser.email,
        password: registereduser.password + "wrong",
      };
      const formData = objectToFormData(userDetails);

      const result = await login(formData);

      expect(result?.success).toBe(false);
    });
    test("should fail if user doesn't exist", async () => {
      const userDetails: LoginFormType = {
        email: "random-email@mail.com",
        password: registereduser.password,
      };
      const formData = objectToFormData(userDetails);

      const result = await login(formData);

      expect(result?.success).toBe(false);
    });
    test("should fail for invalid data", async () => {
      const userDetails = {
        invalid: "some-random-email",
      };
      const formData = objectToFormData(userDetails);

      const result = await login(formData);

      expect(result?.success).toBe(false);
    });
    test("should create a session in DB", async () => {
      // Making sure there are no sessions in the DB from previous register calls
      await prisma.session.deleteMany({
        where: { user: { email: registereduser.email } },
      });

      const userDetails: LoginFormType = {
        email: registereduser.email,
        password: registereduser.password,
      };
      const formData = objectToFormData(userDetails);

      const result = await login(formData);
      const dbUser = await prisma.user.findFirst({
        where: { email: registereduser.email },
        include: { sessions: true },
      });

      expect(result).toBeUndefined();
      expect(dbUser).toBeDefined();
      expect(dbUser!.sessions).toHaveLength(1);
    });
    test("should not return an expired session", async () => {
      const userDetails: LoginFormType = {
        email: registereduser.email,
        password: registereduser.password,
      };
      const formData = objectToFormData(userDetails);

      const dbUser = await prisma.user.findFirst({
        where: { email: userDetails.email },
      });

      // Invalidate the session by setting the expiresAt to a past date
      const session = await prisma.session.update({
        data: { expiresAt: new Date(Date.now() - 1000) },
        where: { userId: dbUser?.id },
      });

      const result = await login(formData);

      expect(result).toBeUndefined();
      // Should not set the auth cookie for the expired session
      expect(setCookieMock).toBeCalledWith(
        lucia.sessionCookieName,
        expect.not.toBeOneOf([session.id]),
        expect.any(Object)
      );
    });
  });
  describe("Logout", () => {
    const user: RegisterFormType = {
      firstName: "Test user",
      lastName: "Test user",
      email: "test@mail.com",
      password: "Testpassword123",
      confirmPassword: "Testpassword123",
    };
    const formData = objectToFormData(user);

    beforeEach(async () => {
      try {
        await resetDb();
        await register(formData);
      } catch (error) {
        console.log(error);
      }
    });

    test("should logout a user successfully", async () => {
      const dbUser = await prisma.user.findFirst({
        where: { email: user.email },
        include: { sessions: true },
      });

      // Mock the get cookie call when it asks for the session cookie
      getCookieMock.mockImplementation(
        (cookieName: string): RequestCookie | undefined => {
          if (cookieName === lucia.sessionCookieName && dbUser?.sessions[0]) {
            return {
              name: lucia.sessionCookieName,
              value: dbUser.sessions[0].id,
            };
          }

          return undefined;
        }
      );

      const response = await logout();
      const dbUserAfterLogout = await prisma.user.findFirst({
        where: { email: user.email },
        include: { sessions: true },
      });

      expect(response.success).toBe(true);
      expect(dbUserAfterLogout!.sessions).toHaveLength(0);
    });
    test("should fail if session cookie is invalid", async () => {
      // Mock the get cookie call when it asks for the session cookie
      getCookieMock.mockImplementation(
        (cookieName: string): RequestCookie | undefined => {
          if (cookieName === lucia.sessionCookieName) {
            return {
              name: lucia.sessionCookieName,
              value: "some-invalid-token",
            };
          }

          return undefined;
        }
      );

      const response = await logout();

      expect(response.success).toBe(false);
    });
  });
  describe("Validate request", () => {
    const user: RegisterFormType = {
      firstName: "Test user",
      lastName: "Test user",
      email: "test@mail.com",
      password: "Testpassword123",
      confirmPassword: "Testpassword123",
    };
    const formData = objectToFormData(user);

    beforeEach(async () => {
      try {
        await resetDb();
        await register(formData);
      } catch (error) {
        console.log(error);
      }
    });
    test("should return currently logged in user and their session", async () => {
      const dbUser = await prisma.user.findFirst({
        where: { email: user.email },
        include: { sessions: true },
      });

      // Mock the get cookie call when it asks for the session cookie
      getCookieMock.mockImplementation(
        (cookieName: string): RequestCookie | undefined => {
          if (cookieName === lucia.sessionCookieName && dbUser?.sessions[0]) {
            return {
              name: lucia.sessionCookieName,
              value: dbUser.sessions[0].id,
            };
          }

          return undefined;
        }
      );

      const result = await validateRequest();

      expect(result.user?.email).toBe(dbUser?.email);
      expect(result.session?.id).toBe(dbUser?.sessions[0].id);
    });
    test("should fail if the session has expired", async () => {
      const dbUser = await prisma.user.findFirst({
        where: { email: user.email },
        include: { sessions: true },
      });

      // Invalidate the session by setting the expiresAt to a past date
      await prisma.session.update({
        data: { expiresAt: new Date(Date.now() - 1000) },
        where: { id: dbUser!.sessions[0].id },
      });

      // Mock the get cookie call when it asks for the session cookie
      getCookieMock.mockImplementation(
        (cookieName: string): RequestCookie | undefined => {
          if (cookieName === lucia.sessionCookieName && dbUser?.sessions[0]) {
            return {
              name: lucia.sessionCookieName,
              value: dbUser.sessions[0].id,
            };
          }

          return undefined;
        }
      );

      const result = await validateRequest();

      expect(result.user).toBeNull();
      expect(result.session).toBeNull();
    });
    test("should fail if the session cookie is invalid", async () => {
      // Mock the get cookie call when it asks for the session cookie
      getCookieMock.mockImplementation(
        (cookieName: string): RequestCookie | undefined => {
          if (cookieName === lucia.sessionCookieName) {
            return {
              name: lucia.sessionCookieName,
              value: "some-invalid-token",
            };
          }

          return undefined;
        }
      );

      const result = await validateRequest();

      expect(result.user).toBeNull();
      expect(result.session).toBeNull();
    });
  });
});
