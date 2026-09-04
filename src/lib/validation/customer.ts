import { AppError } from "@/Errors/AppError";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email format").max(320),
  password: z.string().min(1, "Password is required").max(128),
});

export const registerSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(100),
  email: z.string().trim().email("Invalid email format").max(320),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

export function validateInput<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new AppError(result.error.issues[0]?.message || "Invalid request data", 400);
  }
  return result.data;
}
