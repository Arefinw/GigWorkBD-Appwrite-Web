import { Form, useActionData } from "@remix-run/react";
import { parseWithZod } from "@conform-to/zod";
import { useForm } from "@conform-to/react";
import { z } from "zod";
import "../../styles/login.css";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const action = async ({ request }) => {
  const { redirect } = await import("@remix-run/react");
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: loginSchema });

  if (!submission.value) {
    return { errors: submission.error };
  }

  // Perform login logic here (e.g., authenticate user)

  return redirect("/dashboard"); // Redirect on successful login
};

export default function Login() {
  const lastSubmission = useActionData();
  const [form, fields] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginSchema });
    },
    shouldValidate: "onBlur",
  });

  return (
    <div id="webcrumbs">
      <div className="w-full">
        <main className="flex justify-center items-center min-h-[calc(100vh-76px)] bg-gray-50">
          <div className="w-[400px] p-8 bg-white rounded-2xl shadow-lg border-2 border-teal-400">
            <h2 className="text-2xl font-bold mb-6 text-emerald-500">
              Welcome back
            </h2>
            <Form method="post" {...form.props} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  {...fields.email.props}
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                />
                {fields.email.error && (
                  <p className="text-red-500">{fields.email.error}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  {...fields.password.props}
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                />
                {fields.password.error && (
                  <p className="text-red-500">{fields.password.error}</p>
                )}
              </div>
              <button className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-teal-700 transform hover:-translate-y-0.5 transition-all">
                Log In
              </button>
            </Form>
          </div>
        </main>
      </div>
    </div>
  );
}
