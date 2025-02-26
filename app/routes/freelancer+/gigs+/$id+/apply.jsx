// app/routes/freelancer+/$id+/apply.jsx
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { applicationSchema } from "../../../../utils/schema";
import {
  DocumentTextIcon,
  CurrencyBangladeshiIcon,
} from "@heroicons/react/24/outline";

export async function loader({ request, params }) {
  const { redirect } = await import("@remix-run/node");
  const { getSession } = await import("../../../../utils/session");
  const { createSessionClient } = await import("../../../../utils/appwrite");
  const { DATABASE_ID, GIG_COLLECTION, USER_COLLECTION } = await import(
    "../../../../utils/config"
  );
  const { getUser } = await import("../../../../middleware/database");

  const session = await getSession(request.headers.get("Cookie"));

  if (
    !session.get("secret") ||
    !session.get("userId") ||
    !session.get("role")
  ) {
    return redirect("/login");
  }

  try {
    const { databases } = await createSessionClient(session.get("secret"));

    // Get the gig document
    const gig = await databases.getDocument(
      DATABASE_ID,
      GIG_COLLECTION,
      params.id
    );
    console.log("gig", gig);

    // Get User Document
    const user = await getUser(session.get("userId"));

    // Get the client document
    const client = await databases.getDocument(
      DATABASE_ID,
      USER_COLLECTION,
      user.$id
    );

    return { gig, client };
  } catch (error) {
    console.error("Error during logout:", error);
    return false;
  }
}

export default function ApplyGig() {
  const { gig, client } = useLoaderData();
  const lastSubmission = useActionData();
  const [form, fields] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: applicationSchema });
    },
    shouldValidate: "onBlur",
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Apply to {gig.title}</h1>

        <Form method="post" {...getFormProps(form)} className="space-y-6">
          {form.errors && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {form.errors}
            </div>
          )}

          {/* Proposed Budget Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proposed Budget (৳)
            </label>
            <div className="relative">
              <CurrencyBangladeshiIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                {...getInputProps(fields.proposedBudget, {
                  type: "number",
                  min: 1000,
                  step: 500,
                  placeholder: "Enter proposed amount",
                })}
              />
            </div>
            {fields.proposedBudget.errors && (
              <p className="text-red-500 text-xs mt-1">
                {fields.proposedBudget.errors}
              </p>
            )}
          </div>

          {/* Cover Letter Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter
            </label>
            <div className="relative">
              <DocumentTextIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <textarea
                rows={6}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Explain your qualifications, approach, and why you're the best fit..."
                {...getInputProps(fields.coverletter, { type: "text" })}
              />
            </div>
            {fields.coverletter.errors && (
              <p className="text-red-500 text-xs mt-1">
                {fields.coverletter.errors}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
          >
            Submit Application
          </button>
        </Form>
      </div>
    </div>
  );
}

export async function action({ request, params }) {
  const { redirect } = await import("@remix-run/node");
  const { getSession } = await import("../../../../utils/session");
  const { createSessionClient, Query, Permission, Role, ID } = await import(
    "../../../../utils/appwrite"
  );
  const {
    DATABASE_ID,
    GIG_COLLECTION,
    APPLICATION_COLLECTION,
    USER_COLLECTION,
  } = await import("../../../../utils/config");
  const { getUser } = await import("../../../../middleware/database");
  const { parseWithZod } = await import("@conform-to/zod");
  const { applicationSchema } = await import("../../../../utils/schema");

  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: applicationSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    const freelancer = await getUser(session.get("userId"));
    const { databases } = await createSessionClient(session.get("secret"));

    const gig = await databases.getDocument(
      DATABASE_ID,
      GIG_COLLECTION,
      params.id
    );

    const application = await databases.createDocument(
      DATABASE_ID,
      APPLICATION_COLLECTION,
      ID.unique(),
      {
        freelancerId: freelancer.$id,
        clientId: gig.clientId,
        gigId: gig.$id,
        coverletter: submission.value.coverletter,
        proposedBudget: submission.value.proposedBudget,
      }
    );

    const currentApplications = (await gig.applications) || [];
    const currentApplicantsId = (await gig.applicants) || [];

    await databases.updateDocument(DATABASE_ID, GIG_COLLECTION, gig.$id, {
      applicantsId: [...currentApplicantsId, freelancer.$id],
      applications: [...currentApplications, application.$id],
    });

    const currentUserApplications = (await freelancer.applications) || [];
    const currentAppliedGigs = (await freelancer.appliedGigs) || [];
    await databases.updateDocument(
      DATABASE_ID,
      USER_COLLECTION,
      freelancer.$id,
      {
        appliedGigs: [...currentAppliedGigs, gig.$id],
        applications: [...currentUserApplications, application.$id],
      }
    );
    return redirect("/freelancer/applications");
  } catch (error) {
    console.error("Error during logout:", error);
    return false;
  }
}
