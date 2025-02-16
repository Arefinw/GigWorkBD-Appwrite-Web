import { useTransition } from "react";
import { Form, Link, useSearchParams } from "@remix-run/react";
import {
  KeyIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export async function action({ request }) {
  const formData = await request.formData();
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const token = formData.get("token");

  // Add actual password reset logic:
  // 1. Validate token
  // 2. Check password match
  // 3. Update password in database

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock validation
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  if (token !== "valid-token") {
    return { error: "Invalid or expired token" };
  }

  return { success: true };
}

export default function ResetPassword() {
  const transition = useTransition();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const isSubmitting = transition.state === "submitting";
  const actionData = transition.submission?.formData
    ? transition.submission
    : null;
  const success =
    actionData?.method === "POST" && transition.type === "actionReload";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <KeyIcon className="mx-auto h-12 w-12 text-emerald-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter a new password for your account
          </p>
        </div>

        {!token ? (
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-700">
              Invalid password reset link. Please request a new reset link.
            </p>
          </div>
        ) : success ? (
          <div className="bg-emerald-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-emerald-600 mr-2" />
              <p className="text-sm text-emerald-700">
                Password updated successfully! You can now login with your new
                password.
              </p>
            </div>
          </div>
        ) : (
          <Form className="mt-8 space-y-6" method="post" replace>
            <input type="hidden" name="token" value={token} />

            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="password" className="sr-only">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder="New password"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            {actionData?.error && (
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-700">{actionData.error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </Form>
        )}

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm text-emerald-600 hover:text-emerald-500 inline-flex items-center"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
