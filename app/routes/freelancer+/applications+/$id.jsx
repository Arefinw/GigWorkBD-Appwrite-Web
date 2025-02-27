// app/routes/freelancer+/applications+/$id.jsx
import { useLoaderData, Link, Form } from "@remix-run/react";
import {
  DocumentTextIcon,
  ClockIcon,
  CurrencyBangladeshiIcon,
  UserCircleIcon,
  PencilIcon,
  XCircleIcon,
  EnvelopeIcon,
  CalendarIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

export async function loader({ request, params }) {
  const { redirect } = await import("@remix-run/node");
  const { getSession } = await import("../../../utils/session");
  const { createSessionClient, Query } = await import(
    "../../../utils/appwrite"
  );
  const {
    DATABASE_ID,
    APPLICATION_COLLECTION,
    GIG_COLLECTION,
    USER_COLLECTION,
  } = await import("../../../utils/config");

  const session = await getSession(request.headers.get("Cookie"));

  if (
    !session.get("secret") ||
    !session.get("userId") ||
    session.get("role") !== "freelancer"
  ) {
    return redirect("/login");
  }

  try {
    const { databases } = await createSessionClient(session.get("secret"));
    console.log("params id", params.id);
    // 1. Get Application Document
    const application = await databases.getDocument(
      DATABASE_ID,
      APPLICATION_COLLECTION,
      params.id
    );
    console.log("application", application);

    // 2. Get Related Gig Document
    const gig = await databases.getDocument(
      DATABASE_ID,
      GIG_COLLECTION,
      application.gigId
    );
    console.log("gig", gig);

    // 3. Get Client Document
    const client = await databases.getDocument(
      DATABASE_ID,
      USER_COLLECTION,
      gig.clientId
    );

    return new Response(JSON.stringify({ application, gig, client }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error loading application:", error);
    return redirect("/freelancer/applications");
  }
}

export default function ApplicationDetails() {
  const { application, gig, client } = useLoaderData();
  const statusStyles = {
    accepted: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    rejected: "bg-red-100 text-red-800",
    withdrawn: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{gig.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                statusStyles[application.status]
              }`}
            >
              {application.status}
            </span>
            <span className="text-gray-500 text-sm">
              Applied: {new Date(application.$createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          {application.status === "pending" && (
            <>
              <button className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
                <PencilIcon className="h-5 w-5 mr-2" />
                Edit Proposal
              </button>
              <Form method="POST">
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 border border-red-600 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <XCircleIcon className="h-5 w-5 mr-2" />
                  Withdraw
                </button>
                <input type="hidden" name="_action" value="withdraw" />
              </Form>
            </>
          )}
          <button className="flex items-center px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg">
            <EnvelopeIcon className="h-5 w-5 mr-2" />
            Message Client
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Application Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Proposal Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Your Proposal</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <CurrencyBangladeshiIcon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Proposed Budget</dt>
                    <dd className="font-medium">
                      ৳{application.proposedBudget.toLocaleString()}
                    </dd>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <BriefcaseIcon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Budget Type</dt>
                    <dd className="font-medium capitalize">{gig.budgetType}</dd>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Cover Letter</h3>
              <p className="text-gray-600 whitespace-pre-line">
                {application.coverletter}
              </p>
            </div>
          </div>

          {/* Gig Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Gig Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Original Budget</label>
                <p className="font-medium">
                  ৳{gig.budget.toLocaleString()}
                  {gig.isNegotiable && (
                    <span className="ml-2 text-sm text-gray-500">
                      (Negotiable)
                    </span>
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Duration</label>
                <p className="font-medium">{gig.duration} months</p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {gig.requiredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Client & Timeline */}
        <div className="space-y-6">
          {/* Client Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Client Information</h2>
            <div className="flex items-start gap-4">
              <UserCircleIcon className="h-12 w-12 text-gray-400" />
              <div className="space-y-1">
                <h3 className="font-medium">{client.companyName}</h3>
                <p className="text-gray-600">{client.location}</p>
                <div className="flex items-center">
                  <span className="text-gray-600">
                    Member since {new Date(client.$createdAt).getFullYear()}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 inline mr-1" />
                  Posted {new Date(gig.$createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Application Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-2 h-2 bg-emerald-600 rounded-full" />
                <div>
                  <p className="text-sm font-medium">Proposal submitted</p>
                  <p className="text-sm text-gray-500">
                    {new Date(application.$createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 w-2 h-2 bg-gray-300 rounded-full" />
                <div>
                  <p className="text-sm font-medium">Last updated</p>
                  <p className="text-sm text-gray-500">
                    {new Date(application.$updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function action({ request, params }) {
  const { redirect } = await import("@remix-run/node");
  const { getSession } = await import("../../../utils/session");
  const { createSessionClient, Query, Permission, Role, ID } = await import(
    "../../../utils/appwrite"
  );
  const {
    DATABASE_ID,
    GIG_COLLECTION,
    APPLICATION_COLLECTION,
    USER_COLLECTION,
  } = await import("../../../utils/config");
  const { getUser } = await import("../../../middleware/database");

  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  console.log("formData", formData);

  if (
    !session.get("secret") ||
    !session.get("userId") ||
    session.get("role") !== "freelancer"
  ) {
    return redirect("/login");
  }

  try {
    const { databases } = await createSessionClient(session.get("secret"));

    // Verify the freelancer
    const application = await databases.getDocument(
      DATABASE_ID,
      APPLICATION_COLLECTION,
      params.id
    );

    const freelancer = await getUser(session.get("userId"));

    if (application.freelancerId !== freelancer.$id) {
      return redirect("/freelancer/applications");
    }

    // Update the application
    await databases.updateDocument(
      DATABASE_ID,
      APPLICATION_COLLECTION,
      params.id,
      {
        status: "withdrawn",
      }
    );
    console.log("application", application);
    return redirect("/freelancer/applications");
  } catch (error) {
    console.log("error", error);
    return error;
  }
}
