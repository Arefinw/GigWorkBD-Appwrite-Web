// app/routes/_auth+/signup.jsx
import React from "react";
import {
  getFormProps,
  getInputProps,
  getSelectProps,
  useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { Link } from "@remix-run/react";
import { z } from "zod";
import { Form, useActionData } from "@remix-run/react";
import { registerWithGoogle } from "../../controllers/authController";

import "../../styles/signup.css";

const signupSchema = z
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

export default function Signup() {
  const lastSubmission = useActionData();
  const [form, fields] = useForm({
    lastSubmission,
    constraint: getZodConstraint(signupSchema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onBlur",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signupSchema });
    },
  });

  return (
    <div id="webcrumbs">
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="w-[400px] border border-emerald-500 rounded-lg p-8 bg-white">
          <h2 className="text-2xl font-bold mb-6 text-emerald-500">
            Join GigWorkBD
          </h2>

          <Form method="post" className="space-y-4," {...getFormProps(form)}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  placeholder="First Name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
                  {...getInputProps(fields.firstName, { type: "text" })}
                />
                {fields.fieldName.errors && (
                  <div className="text-red-500 text-sm mt-1">
                    {fields.fieldName.errors}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <input
                  placeholder="Last Name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
                  {...getInputProps(fields.lastName, { type: "text" })}
                />
                {fields.fieldName.errors && (
                  <div className="text-red-500 text-sm mt-1">
                    {fields.fieldName.errors}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
                {...getInputProps(fields.email, { type: "email" })}
              />
              {fields.fieldName.errors && (
                <div className="text-red-500 text-sm mt-1">
                  {fields.fieldName.errors}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
                {...getInputProps(fields.phone, { type: "tel" })}
              />
              {fields.fieldName.errors && (
                <div className="text-red-500 text-sm mt-1">
                  {fields.fieldName.errors}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
                {...getInputProps(fields.password, { type: "password" })}
              />
              {fields.fieldName.errors && (
                <div className="text-red-500 text-sm mt-1">
                  {fields.fieldName.errors}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                placeholder="Confirm Password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
                {...getInputProps(fields.confirmPassword, { type: "password" })}
              />
              {fields.confirmPassword.errors && (
                <div className="text-red-500 text-sm mt-1">
                  {fields.confirmPassword.errors}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                name={fields.role.name}
                className="block w-full border rounded-lg py-2 px-3 mb-4 bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
                defaultValue={fields.role.value}
                {...getSelectProps(fields.role)}
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="freelancer">Freelancer</option>
                <option value="client">Client</option>
              </select>
              {fields.fieldName.errors && (
                <div className="text-red-500 text-sm mt-1">
                  {fields.fieldName.errors}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transform hover:scale-[1.02] transition duration-200"
            >
              Sign Up
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t w-full absolute" />
              <span className="bg-white px-2 text-sm text-gray-500 relative">
                or
              </span>
            </div>

            <button
              type="button"
              onClick={registerWithGoogle}
              className="w-full border py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transform hover:scale-[1.02] transition duration-200"
            >
              <i className="fa-brands fa-google text-xl" />
              Sign up with Google
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export async function action({ request }) {
  // imports
  const { redirect } = await import("@remix-run/react");
  const { createUser } = await import("../controllers/authController");
  const { createSessionClient } = await import("../../utils/appwrite");
  const { getSession, commitSession } = await import("../utils/session");

  // Parse form data
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: signupSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }
  try {
    // Create user in Appwrite
    const appwriteSession = await createUser(submission);

    // Create session Clinet
    const { account } = await createSessionClient(appwriteSession);

    // Update prefs
    await account.updatePrefs({
      role: submission.value.role,
    });

    // Create session
    const session = await getSession();
    session.set("secret", appwriteSession.secret);

    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: error.message,
      }),
      { status: 400 }
    );
  }
}
