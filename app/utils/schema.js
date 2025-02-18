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

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
});

export const gigSchema = z.object({
  title: z
    .string()
    .min(6, { message: "Title must be at least 6 characters" })
    .min(1, { message: "Title is required" }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters" })
    .min(1, { message: "Description is required" }),
  budget: z.string().min(1, { message: "Budget is required" }),
  budgetType: z.enum(["fixed", "monthly"], {
    required_error: "Budget type is required",
  }),
  skills: z
    .array(z.string().min(2, "Skill must be at least 2 characters"))
    .min(1, "At least one skill is required"),
  experience: z.string().min(1, { message: "Experience is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  deadline: z.string().min(1, { message: "Deadline is required" }),
});
