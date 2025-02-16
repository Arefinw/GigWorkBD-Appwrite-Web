// app/utils/schema.js
import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z.string().min(2, { message: "First name is required" }),
    lastName: z.string().min(2, { message: "Last name is required" }),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" }),
    phone: z
      .string()
      .regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Invalid Bangladeshi phone number")
      .min(1, { message: "Phone number is required" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .min(1, { message: "Password is required" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
    role: z.enum(["freelancer", "client"], {
      required_error: "Role is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
