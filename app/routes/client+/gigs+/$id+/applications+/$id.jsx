// app/routes/client+/gigs+/$gigId+/applications+/$id.jsx
import { useLoaderData, Link, Form } from "@remix-run/react";
import {
  BriefcaseIcon,
  CurrencyBangladeshiIcon,
  UserCircleIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export async function loader({ request, params }) {
  const { redirect } = await import("@remix-run/node");
  const { getSession } = await import("../../../../../utils/session");
  const { createSessionClient, Query } = await import(
    "../../../../../utils/appwrite"
  );
  const { getUser } = await import("../../../../../middleware/database");
  const {
    DATABASE_ID,
    APPLICATION_COLLECTION,
    GIG_COLLECTION,
    USER_COLLECTION,
  } = await import("../../../../../utils/config");

  const session = await getSession(request.headers.get("Cookie"));

  if (
    !session.get("secret") ||
    !session.get("userId") ||
    session.get("role") !== "client"
  ) {
    return redirect("/login");
  }

  try {
    const { databases } = await createSessionClient(session.get("secret"));

    // Get application document
    const application = await databases.getDocument(
      DATABASE_ID,
      APPLICATION_COLLECTION,
      params.id
    );

    // Get related gig document
    const gig = await databases.getDocument(
      DATABASE_ID,
      GIG_COLLECTION,
      application.gigId
    );

    // Check if the gig belongs to the client
    const client = await getUser(session.get("userId"));
    if (gig.clientId !== client.$id) {
      return redirect("/client/gigs");
    }

    // Check if the Gig is open or in progress
    if (!["open", "in-progress"].includes(gig.status)) {
      console.log("Gig is not open or in progress");
      return redirect(`/client/gigs/${gig.$id}`);
    }

    // Get freelancer document
    const freelancer = await databases.getDocument(
      DATABASE_ID,
      USER_COLLECTION,
      application.freelancerId
    );

    return new Response(
      JSON.stringify({
        application,
        gig,
        freelancer,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error loading application:", error);
    throw new Response("Application not found", { status: 404 });
  }
}

export default function ApplicationDetails() {
  const { application, gig, freelancer } = useLoaderData();

  const statusStyles = {
    pending: "bg-amber-100 text-amber-800",
    accepted: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-800",
    withdrawn: "bg-gray-100 text-gray-800",
    shortlisted: "bg-blue-100 text-blue-800", // New status style
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to={`/client/gigs/${gig.$id}/applications`}
        className="mb-8 inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Applications
      </Link>

      {/* Header Section with Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BriefcaseIcon className="h-8 w-8 text-emerald-600 mr-3" />
              {gig.title}
            </h1>
            <div className="mt-4 flex items-center space-x-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusStyles[application.status]
                }`}
              >
                {application.status}
              </span>
              <div className="flex items-center text-gray-500">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Applied: {new Date(application.$createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Actions Moved to Header */}
          <div className="flex flex-col gap-3 w-full sm:w-auto">
            {application.status === "pending" && (
              <Form method="post" className="flex gap-3 flex-wrap">
                <button
                  type="submit"
                  name="_action"
                  value="accept"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex-1"
                >
                  Accept Proposal
                </button>
                <button
                  type="submit"
                  name="_action"
                  value="shortlist"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex-1"
                >
                  Shortlist
                </button>
                <button
                  type="submit"
                  name="_action"
                  value="reject"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex-1"
                >
                  Reject Proposal
                </button>
              </Form>
            )}
            <Link
              to={`/messages/new/${freelancer.$id}`}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-center"
            >
              Send Message
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Proposal Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <DocumentTextIcon className="h-6 w-6 text-emerald-600 mr-2" />
              Proposal Details
            </h2>

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
                    <ChartBarIcon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Status</dt>
                    <dd className="font-medium capitalize">
                      {application.status}
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium mb-2">Cover Letter</h3>
              <p className="text-gray-600 whitespace-pre-line">
                {application.coverletter}
              </p>
            </div>
          </div>

          {/* Gig Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BriefcaseIcon className="h-6 w-6 text-emerald-600 mr-2" />
              Gig Details
            </h2>
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
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Freelancer Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <UserCircleIcon className="h-6 w-6 text-emerald-600 mr-2" />
              Freelancer Profile
            </h2>

            <div className="flex items-start gap-4 mb-4">
              <UserCircleIcon className="h-12 w-12 text-gray-400" />
              <div className="space-y-1">
                <h3 className="font-medium">{freelancer.fullName}</h3>
                <p className="text-sm text-gray-600">
                  Member since {new Date(freelancer.$createdAt).getFullYear()}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Experience Level</span>
                <span className="font-medium">
                  {freelancer.experienceLevel}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Location</span>
                <span className="font-medium">{freelancer.location}</span>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ClockIcon className="h-6 w-6 text-emerald-600 mr-2" />
              Application Timeline
            </h2>
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
              {application.status !== "pending" && (
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-2 h-2 bg-emerald-600 rounded-full" />
                  <div>
                    <p className="text-sm font-medium">
                      Status updated to {application.status}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(application.$updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function action({ request, params }) {
  const { redirect } = await import("@remix-run/node");
  const { getUser } = await import("../../../../../middleware/database");
  const { getSession } = await import("../../../../../utils/session");
  const { createSessionClient } = await import("../../../../../utils/appwrite");
  const { DATABASE_ID, APPLICATION_COLLECTION, GIG_COLLECTION } = await import(
    "../../../../../utils/config"
  );

  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const actionType = formData.get("_action");

  if (!session.get("secret") || !session.get("userId")) {
    return redirect("/login");
  }

  try {
    const { databases } = await createSessionClient(session.get("secret"));

    // Get the application document
    const application = await databases.getDocument(
      DATABASE_ID,
      APPLICATION_COLLECTION,
      params.id
    );

    // Get related gig document
    const gig = await databases.getDocument(
      DATABASE_ID,
      GIG_COLLECTION,
      application.gigId
    );

    // Get client document
    const client = await getUser(session.get("userId"));

    // Verify client ownership
    if (gig.clientId !== client.$id) {
      return redirect("/client/gigs");
    }

    let updateData = {};

    switch (actionType) {
      case "accept":
        updateData = {
          status: "accepted",
        };
        break;

      case "shortlist": // New case
        updateData = {
          status: "shortlisted",
        };
        break;

      case "reject":
        updateData = {
          status: "rejected",
        };
        break;

      default:
        throw new Error("Invalid action type");
    }

    // Update the application
    const updatedApplication = await databases.updateDocument(
      DATABASE_ID,
      APPLICATION_COLLECTION,
      params.id,
      updateData
    );

    // Optional: Update gig status if needed
    if (actionType === "accept" && gig.status === "open") {
      await databases.updateDocument(DATABASE_ID, GIG_COLLECTION, gig.$id, {
        status: "in-progress",
      });
    }

    return redirect(`/client/gigs/${gig.$id}/applications/${params.id}`);
  } catch (error) {
    console.error("Error processing application:", error);
    throw new Response("Failed to process application", { status: 500 });
  }
}

// Optional helper function to close other applications
// async function closeOtherApplications(gigId, currentApplicationId, databases) {
//   const applications = await databases.listDocuments(
//     DATABASE_ID,
//     APPLICATION_COLLECTION,
//     [
//       Query.equal("gigId", gigId),
//       Query.equal("status", "pending"),
//       Query.notEqual("$id", currentApplicationId),
//     ]
//   );

//   const updates = applications.documents.map((app) =>
//     databases.updateDocument(DATABASE_ID, APPLICATION_COLLECTION, app.$id, {
//       status: "rejected",
//     })
//   );

//   await Promise.all(updates);
// }
