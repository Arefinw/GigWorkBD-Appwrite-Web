// app/routes/_auth+/login.jsx
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Form, useActionData, Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { loginSchema } from "../../utils/schema";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

export default function Login() {
  const lastSubmission = useActionData();

  const [form, fields] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginSchema });
    },
    shouldValidate: "onBlur",
  });

  console.log("fields", fields);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[420px] bg-white rounded-xl shadow-lg border border-emerald-100"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-emerald-600 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-sm">
              Continue your freelance journey
            </p>
          </div>

          <Form method="POST" {...getFormProps(form)} className="space-y-5">
            <div className="space-y-2">
              <div className="relative">
                <EnvelopeIcon className="h-4 w-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  placeholder="Email"
                  className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  {...getInputProps(fields.email, { type: "email" })}
                />
              </div>
              {fields.email.errors && (
                <p className="text-red-500 text-xs mt-1">
                  {fields.email.errors}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <LockClosedIcon className="h-4 w-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  placeholder="Password"
                  className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  {...getInputProps(fields.password, { type: "password" })}
                />
              </div>
              {fields.password.errors && (
                <p className="text-red-500 text-xs mt-1">
                  {fields.password.errors}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-emerald-600 hover:text-emerald-700"
              >
                Forgot password?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-emerald-500 text-white py-2.5 text-sm rounded-lg font-medium hover:bg-emerald-600 transition-colors"
            >
              Log In
            </motion.button>
            {lastSubmission?.status === "error" && (
              <p className="text-red-500 text-sm text-center">
                {lastSubmission.message}
              </p>
            )}

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              name="intent"
              value="google-auth"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              <span>Continue with Google</span>
            </motion.button>

            <p className="text-center text-gray-600 text-xs mt-4">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Sign up
              </Link>
            </p>
          </Form>
        </div>
      </motion.div>
    </div>
  );
}

export async function action({ request }) {
  console.log("login action triggered...");
  try {
    const { redirect } = await import("@remix-run/node");
    const { parseWithZod } = await import("@conform-to/zod");
    const { createSessionClient } = await import("../../utils/appwrite");
    const { login } = await import("../../controllers/authController");
    const { getSession, commitSession } = await import("../../utils/session");
    const { loginSchema } = await import("../../utils/schema");
    const formData = await request.formData();
    const intent = formData.get("intent");

    // Handle Google Authentication
    if (intent === "google-auth") {
      try {
        const { redirectToGoogleAuth } = await import(
          "../../controllers/authController"
        );
        return await redirectToGoogleAuth();
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

    // Handle Email/Password Login
    const submission = parseWithZod(formData, { schema: loginSchema });

    if (submission.status !== "success") {
      return submission.reply();
    }

    const appwriteSession = await login(submission);

    const { userId, secret } = appwriteSession;

    // Create session Clinet
    const { account } = await createSessionClient(secret);

    // Get prefs
    const prefs = await account.getPrefs();

    const session = await getSession();
    session.set("userId", userId);
    session.set("secret", secret);
    session.set("role", prefs.role);

    return redirect(`/${prefs.role}/dashboard`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({
        status: "error",
        message: error.message,
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
