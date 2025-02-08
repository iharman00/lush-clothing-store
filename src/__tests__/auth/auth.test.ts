import { describe, test, expect, vi, beforeEach } from "vitest";
import register from "@/auth/actions/register";
import { RegisterFormType } from "@/schemas/auth/registerFormSchema";
import prisma from "../helpers/prisma";
import resetDb from "../helpers/reset-db";
import { cookies } from "next/headers";

vi.mock("@/auth/actions/sendOTPEmail", () => ({
  default: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    set: vi.fn(),
  })),
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

    test("should return error for invalid form data", async () => {
      const user = { email: "not-an-email" };
      const invalidFormData = objectToFormData(user);

      const result = await register(invalidFormData);

      const dbUser = await prisma.user.findFirst({
        where: { email: user.email },
      });
      expect(dbUser).toBeNull();

      expect(result).toEqual({
        success: false,
        message: expect.any(String),
        fields: expect.any(Object),
        errors: expect.any(Object),
      });
    });

    test("should return error if a user already exists", async () => {
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

      expect(result).toEqual({
        success: false,
        message: expect.any(String),
        errors: expect.any(Object),
        fields: expect.any(Object),
      });
    });
  });
});
