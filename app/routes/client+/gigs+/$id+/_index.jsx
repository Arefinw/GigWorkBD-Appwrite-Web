// app/routes/client+/gigs.$id.jsx
import { useLoaderData, Link, Form } from "@remix-run/react";
import {
  BriefcaseIcon,
  CurrencyBangladeshiIcon,
  CalendarIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  LockClosedIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export async function loader({ request, params }) {
  const { redirect } = await import("@remix-run/node");
  const { getSession } = await import("../../../../utils/session");
  const { createSessionClient, Query } = await import(
    "../../../../utils/appwrite"
  );
  const { DATABASE_ID, GIG_COLLECTION, APPLICATION_COLLECTION } = await import(
    "../../../../utils/config"
  );

  const session = await getSession(request.headers.get("Cookie"));

  if (!session.get("secret") || !session.get("userId")) {
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

    // Get active applications (excluding withdrawn)
    const applications = await databases.listDocuments(
      DATABASE_ID,
      APPLICATION_COLLECTION,
      [Query.equal("gigId", params.id), Query.notEqual("status", "withdrawn")]
    );

    return new Response(
      JSON.stringify({
        gig,
        activeApplications: applications.total,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error loading gig:", error);
    throw new Response("Gig not found", { status: 404 });
  }
}

export default function GigDetails() {
  const { gig, activeApplications } = useLoaderData();

  const statusConfig = {
    open: {
      color: "bg-green-100 text-green-800",
      label: "Accepting Applications",
    },
    "in-progress": { color: "bg-blue-100 text-blue-800", label: "In Progress" },
    completed: { color: "bg-purple-100 text-purple-800", label: "Completed" },
    withdrawn: { color: "bg-red-100 text-red-800", label: "Withdrawn" },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Navigation */}
      <Link
        to="/client/gigs"
        className="mb-8 inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to All Gigs
      </Link>

      {/* Gig Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BriefcaseIcon className="h-8 w-8 text-emerald-600" />
              {gig.title}
            </h1>
            <div className="mt-4 flex items-center flex-wrap gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusConfig[gig.status].color
                }`}
              >
                {statusConfig[gig.status].label}
              </span>
              <div className="flex items-center text-gray-500">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Posted: {new Date(gig.$createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full sm:w-auto">
            {gig.status !== "withdrawn" && (
              <Link
                to={`/client/gigs/${gig.$id}/applications`}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <UserGroupIcon className="h-5 w-5" />
                View Applications ({activeApplications})
              </Link>
            )}

            <div className="flex gap-3">
              {gig.status === "open" && (
                <Form method="post">
                  <button
                    type="submit"
                    name="_action"
                    value="in-progress"
                    className="px-4 py-2 border border-red-600 text-red-600 hover:bg-red-50 rounded-lg font-medium flex-1 flex items-center justify-center gap-2"
                  >
                    <LockClosedIcon className="h-5 w-5" />
                    Stop Accepting Applications
                  </button>
                </Form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gig Details Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Budget & Duration Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CurrencyBangladeshiIcon className="h-6 w-6 text-emerald-600" />
              Project Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem
                label="Budget"
                value={`৳${gig.budget.toLocaleString()}`}
              />
              <DetailItem label="Duration" value={`${gig.duration} months`} />
              <DetailItem label="Budget Type" value={gig.budgetType} />
              <DetailItem
                label="Negotiable"
                value={gig.isNegotiable ? "Yes" : "No"}
                className={
                  gig.isNegotiable ? "text-emerald-600" : "text-gray-600"
                }
              />
            </div>
          </div>

          {/* Skills & Description Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <DocumentTextIcon className="h-6 w-6 text-emerald-600" />
              Requirements
            </h2>
            <div className="space-y-4">
              <div>
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
              <div>
                <h3 className="font-medium mb-2">Full Description</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {gig.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Status Management */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <XCircleIcon className="h-6 w-6 text-red-600" />
              Danger Zone
            </h2>
            <div className="space-y-4">
              <Form method="post">
                <button
                  type="submit"
                  name="_action"
                  value="withdraw-gig"
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                  disabled={["completed", "withdrawn"].includes(gig.status)}
                >
                  <XCircleIcon className="h-5 w-5" />
                  {gig.status === "withdrawn"
                    ? "Gig Withdrawn"
                    : "Withdraw Gig"}
                </button>
              </Form>
              <p className="text-sm text-gray-500">
                Withdrawing the gig will: - Permanently remove it from public
                listings - Prevent any new applications - Notify existing
                applicants - Cannot be undone
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value, className = "" }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className={`mt-1 font-semibold ${className}`}>{value}</dd>
    </div>
  );
}

export async function action({ request, params }) {
  const { redirect } = await import("@remix-run/node");
  const { getSession } = await import("../../../../utils/session");
  const { createSessionClient, Query } = await import(
    "../../../../utils/appwrite"
  );
  const { DATABASE_ID, GIG_COLLECTION, APPLICATION_COLLECTION } = await import(
    "../../../../utils/config"
  );

  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const action = formData.get("_action");
  console.log("role", session.get("role"));

  if (
    !session.get("secret") ||
    !session.get("userId") ||
    session.get("role") !== "client"
  ) {
    return redirect("/login");
  }
  try {
    const { databases } = await createSessionClient(session.get("secret"));
    const applications = await databases.listDocuments(
      DATABASE_ID,
      APPLICATION_COLLECTION,
      [Query.equal("gigId", params.id)]
    );

    switch (action) {
      case "in-progress":
        await databases.updateDocument(DATABASE_ID, GIG_COLLECTION, params.id, {
          status: "in-progress",
        });
        break;

      case "withdraw-gig":
        await Promise.all(
          applications.documents.map(async (application) => {
            await databases.updateDocument(
              DATABASE_ID,
              APPLICATION_COLLECTION,
              application.$id,
              {
                status: "gig-withdrawn",
              }
            );
          })
        );
        await databases.updateDocument(DATABASE_ID, GIG_COLLECTION, params.id, {
          status: "withdrawn",
        });
        // Add logic to notify applicants
        break;
    }

    return redirect(`/client/gigs/${params.id}`);
  } catch (error) {
    console.error("Error updating gig:", error);
    throw new Response("Failed to update gig", { status: 500 });
  }
}
