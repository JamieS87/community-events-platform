import { z } from "zod";

export const signUpFormSchema = z
  .object({
    firstname: z
      .string({ message: "first name is required" })
      .min(1, { message: "first name is required" })
      .regex(/^[a-zA-Z]+$/, {
        message: "first name must consist of only lower and uppercase letters",
      }),
    lastname: z
      .string({ message: "last name is required" })
      .min(1, { message: "last name is required" })
      .regex(/^[a-zA-Z]+$/, {
        message: "last name must consist of only lower and uppercase letters",
      }),
    email: z
      .string({ message: "Email address is required" })
      .email({ message: "Email must be a valid email address" }),
    password: z
      .string({ message: "Password is required" })
      .min(10, { message: "Password must be at least 10 characters" })
      .max(100, { message: "Password must be at most 100 characters" }),
    passwordRepeat: z
      .string({ message: "Password repeat is required" })
      .min(10, { message: "Password repeat must be at least 10 characters" })
      .max(100, { message: "Password repeat must be at most 100 characters" }),
  })
  .superRefine((schema, ctx) => {
    if (schema.password !== schema.passwordRepeat) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords must match",
        path: ["passwordRepeat"],
      });
    }
  });
