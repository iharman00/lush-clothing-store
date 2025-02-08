import { vi } from "vitest";

vi.mock("react", async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import("react")>()),
    cache: (arg: any) => arg,
    experimental_taintUniqueValue: vi.fn(),
  };
});

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("server-only", () => ({}));
