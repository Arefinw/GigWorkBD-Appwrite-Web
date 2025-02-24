// app/routes/client+/gigs.$id.jsx
import { useLoaderData, Link } from "@remix-run/react";
import {
  BriefcaseIcon,
  CurrencyBangladeshiIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export async function loader({ request, params }) {
  const { redirect } = await import("@remix-run/node");
  const { getSession } = await import("../../../utils/session");
  const { createSessionClient, Query } = await import(
    "../../../utils/appwrite"
  );
  const { DATABASE_ID, GIG_COLLECTION, USER_COLLECTION } = await import(
    "../../../utils/config"
  );
  try {
    console.log("params", params.id);

    const session = await getSession(request.headers.get("Cookie"));

    if (!session.get("secret") || !session.get("userId")) {
      return redirect("/login");
    }

    const { databases } = await createSessionClient(session.get("secret"));
    // Get the gig document
    const gig = await databases.getDocument(
      DATABASE_ID,
      GIG_COLLECTION,
      params.id
    );
    console.log("gig", gig);

    // Get applicants using the relationship
    const applicants = await databases.listDocuments(
      DATABASE_ID,
      USER_COLLECTION,
      [Query.contains("appliedGigs", gig.$id)] // Query users who applied to this gig
    );

    console.log("applicants", applicants);

    return new Response(JSON.stringify({ gig, applicants }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("error", error);
    throw new Response("Gig not found", { status: 404 });
  }
}

export default function GigDetails() {
  const { gig, applicants } = useLoaderData();

  const statusStyles = {
    open: "bg-green-100 text-green-800",
    closed: "bg-red-100 text-red-800",
    completed: "bg-gray-100 text-gray-800",
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
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BriefcaseIcon className="h-8 w-8 text-emerald-600 mr-3" />
              {gig.title}
            </h1>
            <div className="mt-4 flex items-center space-x-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusStyles[gig.status.toLowerCase()] || statusStyles.closed
                }`}
              >
                {gig.status}
              </span>
              <div className="flex items-center text-gray-500">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Posted: {new Date(gig.$createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gig Details Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <DocumentTextIcon className="h-6 w-6 text-emerald-600 mr-2" />
              Gig Details
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Budget:</span>
                <div className="flex items-center text-emerald-600">
                  <CurrencyBangladeshiIcon className="h-5 w-5 mr-1" />
                  <span>
                    ৳{gig.budget.toLocaleString()} ({gig.budgetType})
                  </span>
                  {gig.isNegotiable && (
                    <span className="ml-2 text-sm text-gray-500">
                      (Negotiable)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Duration:</span>
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  {gig.duration} months
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Required Skills:</h3>
                <div className="flex flex-wrap gap-2">
                  {gig.requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <DocumentTextIcon className="h-6 w-6 text-emerald-600 mr-2" />
              Full Description
            </h2>
            <p className="text-gray-600 whitespace-pre-line">
              {gig.description}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Client Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <UserGroupIcon className="h-6 w-6 text-emerald-600 mr-2" />
              Client Information
            </h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Experience Level:</span>{" "}
                {gig.experienceLevel}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Category:</span> {gig.category}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Subcategory:</span>{" "}
                {gig.subcategory}
              </p>
            </div>
          </div>

          {/* Applications Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ChartBarIcon className="h-6 w-6 text-emerald-600 mr-2" />
              Applications
            </h2>
            <div className="space-y-4">
              {applicants.length > 0 ? (
                applicants.map((applicant) => (
                  <div
                    key={applicant.id}
                    className="p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <h3 className="font-medium">{applicant.name}</h3>
                    <p className="text-sm text-gray-500">{applicant.email}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No applications yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
