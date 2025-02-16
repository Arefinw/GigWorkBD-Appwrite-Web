import { useTransition } from "react";
import { Form, Link } from "@remix-run/react";
import { EnvelopeOpenIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");

  // Add your actual password reset logic here
  // Example: await sendPasswordResetEmail(email);

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true };
}

export default function ForgotPassword() {
  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";
  const success =
    transition.submission?.formData.get("email") &&
    transition.type === "actionReload";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to receive a password reset link
          </p>
        </div>

        {success ? (
          <div className="bg-emerald-50 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <EnvelopeOpenIcon className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-emerald-700">
                  We've sent a password reset link to your email. Please check
                  your inbox and follow the instructions.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Form className="mt-8 space-y-6" method="post" replace>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
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
