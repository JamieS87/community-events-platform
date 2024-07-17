import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string({ message: "Email address is required" })
    .email({ message: "Email must be a valid email address" }),
  password: z
    .string({ message: "Password is required" })
    .min(10, { message: "Password must be at least 10 characters" })
    .max(100, { message: "Password must be at most 100 characters" }),
});