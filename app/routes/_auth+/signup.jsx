// app/routes/_auth+/signup.jsx
import {
  getFormProps,
  getInputProps,
  getSelectProps,
  useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { Form, useActionData, Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { signupSchema } from "../../utils/schema";
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

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
              Join GigWorkBD
            </h2>
            <p className="text-gray-600 text-sm">
              Start your freelance journey in minutes
            </p>
          </div>

          <Form method="POST" {...getFormProps(form)} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="relative">
                  <UserCircleIcon className="h-4 w-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    placeholder="First Name"
                    className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    {...getInputProps(fields.firstName, { type: "text" })}
                  />
                </div>
                {fields.firstName.errors && (
                  <p className="text-red-500 text-xs mt-1">
                    {fields.firstName.errors}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <UserCircleIcon className="h-4 w-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    placeholder="Last Name"
                    className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    {...getInputProps(fields.lastName, { type: "text" })}
                  />
                </div>
                {fields.lastName.errors && (
                  <p className="text-red-500 text-xs mt-1">
                    {fields.lastName.errors}
                  </p>
                )}
              </div>
            </div>

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
                <PhoneIcon className="h-4 w-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  placeholder="Phone Number"
                  className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  {...getInputProps(fields.phone, { type: "tel" })}
                />
              </div>
              {fields.phone.errors && (
                <p className="text-red-500 text-xs mt-1">
                  {fields.phone.errors}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
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

              <div className="space-y-2">
                <div className="relative">
                  <LockClosedIcon className="h-4 w-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    placeholder="Confirm Password"
                    className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    {...getInputProps(fields.confirmPassword, {
                      type: "password",
                    })}
                  />
                </div>
                {fields.confirmPassword.errors && (
                  <p className="text-red-500 text-xs mt-1">
                    {fields.confirmPassword.errors}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <BriefcaseIcon className="h-4 w-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  {...getSelectProps(fields.role)}
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  <option value="freelancer">Freelancer</option>
                  <option value="client">Client</option>
                </select>
              </div>
              {fields.role.errors && (
                <p className="text-red-500 text-xs mt-1">
                  {fields.role.errors}
                </p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-emerald-500 text-white py-2.5 text-sm rounded-lg font-medium hover:bg-emerald-600 transition-colors"
            >
              Create Account
            </motion.button>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">Or</span>
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
                {/* Google SVG icon */}
              </svg>
              Sign up with Google
            </motion.button>

            <p className="text-center text-gray-600 text-xs mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Log in here
              </Link>
            </p>
          </Form>
        </div>
      </motion.div>
    </div>
  );
}

export async function action({ request }) {
  // imports
  const { redirect } = await import("@remix-run/react");
  const { createUser, registerWithGoogle } = await import(
    "../../controllers/authController"
  );
  const { createSessionClient } = await import("../../utils/appwrite");
  const { getSession, commitSession } = await import("../../utils/session");

  console.log("signup action triggered...");
  // Parse form data
  const formData = await request.formData();
  const intent = formData.get("intent");
  const origin = new URL(request.url).origin;

  if (intent === "google-auth") {
    try {
      return await registerWithGoogle();
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
  const submission = parseWithZod(formData, { schema: signupSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }
  try {
    // Create user in Appwrite
    const appwriteSession = await createUser(submission);
    console.log(appwriteSession);

    const { userId, secret } = appwriteSession;

    // Create session Clinet
    const { account } = await createSessionClient(secret);

    // Email Verification
    await account.createVerification(`${origin}/verifyEmail`);

    // Update prefs
    await account.updatePrefs({
      role: submission.value.role,
      provider: "email",
      isEmailVerified: false,
      isPhoneVerified: false,
      isNIDVerified: false,
    });

    // Update Phone
    await account.updatePhone(
      submission.value.phone,
      submission.value.password
    );
    // Create session
    const session = await getSession();
    session.set("userId", userId);
    session.set("secret", secret);
    session.set("role", submission.value.role);
    console.log(session);
    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        status: "error",
        message: error.message,
      }),
      { status: 400 }
    );
  }
}
