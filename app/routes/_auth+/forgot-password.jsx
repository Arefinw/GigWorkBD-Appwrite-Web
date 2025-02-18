// app/routes/_auth+/forgot-password.jsx
import { useTransition } from "react";
import { Form, Link, useActionData } from "@remix-run/react";
import { EnvelopeOpenIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useForm, getFormProps, getInputProps } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { forgotPasswordSchema } from "../../utils/schema";

export default function ForgotPassword() {
  const lastSubmission = useActionData();
  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";
  const success = lastSubmission?.success;

  // Set up form handling with Conform
  const [form, fields] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: forgotPasswordSchema });
    },
    shouldValidate: "onBlur",
  });

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

export async function action({ request }) {
  const { parseWithZod } = await import("@conform-to/zod");
  const { forgotPasswordSchema } = await import("../../utils/schema");
  const { createAdminClient } = await import("../../utils/appwrite");
  const formData = await request.formData();
  const origin = new URL(request.url).origin;

  const submission = await parseWithZod(formData, {
    schema: forgotPasswordSchema,
  });

  if (!submission.value) {
    return submission.reply();
  }

  const { account } = await createAdminClient();

  try {
    const email = submission.value.email;
    await account.createRecovery(email, `${origin}/reset-password`);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
