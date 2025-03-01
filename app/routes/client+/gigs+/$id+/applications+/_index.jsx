// app/routes/client+/gigs+/$id+/applications.jsx
import { useState } from "react";
import { useLoaderData, Link, Form } from "@remix-run/react";
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  UserCircleIcon,
  CurrencyBangladeshiIcon,
  CalendarIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export async function loader({ params, request }) {
  const { redirect } = await import("@remix-run/node");
  const { getSession } = await import("../../../../../utils/session");
  const { createSessionClient, Query } = await import(
    "../../../../../utils/appwrite"
  );
  const {
    DATABASE_ID,
    GIG_COLLECTION,
    APPLICATION_COLLECTION,
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

    // Get the gig document
    const gig = await databases.getDocument(
      DATABASE_ID,
      GIG_COLLECTION,
      params.id
    );

    // Check if the Gig Exists
    if (!gig) {
      return redirect(`/client/gigs`);
    }

    // Check Gig Status
    if (!["open", "in-progress"].includes(gig.status)) {
      return redirect(`/client/gigs/${params.id}`);
    }

    // Get applications for this gig (excluding withdrawn)
    const applications = await databases.listDocuments(
      DATABASE_ID,
      APPLICATION_COLLECTION,
      [Query.equal("gigId", params.id), Query.notEqual("status", "withdrawn")]
    );

    // Get related freelancers
    const freelancerIds = applications.documents.map((app) => app.freelancerId);
    const freelancers =
      freelancerIds.length > 0
        ? await databases.listDocuments(DATABASE_ID, USER_COLLECTION, [
            Query.equal("$id", freelancerIds),
          ])
        : { documents: [] };

    // Calculate stats
    const stats = {
      total: applications.total,
      pending: applications.documents.filter((a) => a.status === "pending")
        .length,
      accepted: applications.documents.filter((a) => a.status === "accepted")
        .length,
      rejected: applications.documents.filter((a) => a.status === "rejected")
        .length,
    };

    return new Response(
      JSON.stringify({
        gig,
        applications: applications.documents,
        freelancers: freelancers.documents,
        stats,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error loading applications:", error);
    throw new Response("Applications not found", { status: 404 });
  }
}

export default function GigApplications() {
  const { gig, applications, freelancers, stats } = useLoaderData();
  const [activeFilter, setActiveFilter] = useState("all");

  const statusStyles = {
    pending: "bg-amber-100 text-amber-800",
    accepted: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-800",
  };

  const filteredApplications =
    activeFilter === "all"
      ? applications
      : applications.filter((app) => app.status === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
        <Link
          to={`/client/gigs/${gig.$id}`}
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Gig Details
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Applications for {gig.title}
        </h1>
      </div>

      {/* Stats and Filters */}
      <div className="mb-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={DocumentTextIcon} title="Total" value={stats.total} />
          <StatCard icon={ClockIcon} title="Pending" value={stats.pending} />
          <StatCard
            icon={CheckCircleIcon}
            title="Accepted"
            value={stats.accepted}
          />
          <StatCard
            icon={XCircleIcon}
            title="Rejected"
            value={stats.rejected}
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === "all"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              All Applications ({stats.total})
            </button>
            {Object.entries({
              pending: "Pending",
              accepted: "Accepted",
              rejected: "Rejected",
            }).map(([status, label]) => (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  statusStyles[status]
                } ${activeFilter === status ? "ring-2 ring-black" : ""}`}
              >
                {label} ({stats[status]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {filteredApplications.map((application) => {
          const freelancer = freelancers.find(
            (f) => f.$id === application.freelancerId
          );

          return (
            <div
              key={application.$id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                {/* Application Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {freelancer?.fullName || "Unknown Freelancer"}
                      </h2>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        statusStyles[application.status]
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <CurrencyBangladeshiIcon className="h-5 w-5 text-emerald-600" />
                      <span className="font-medium">
                        ৳{application.proposedBudget?.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">Proposed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-emerald-600" />
                      <span className="text-sm">
                        Applied:{" "}
                        {new Date(application.$createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Cover Letter</h3>
                    <p className="text-gray-600 line-clamp-3">
                      {application.coverletter}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="md:w-64 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Manage Application</h3>
                    <div className="flex flex-col gap-2">
                      <Link
                        to={`/client/gigs/${gig.$id}/applications/${application.$id}`}
                        className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-center"
                      >
                        View Details
                      </Link>
                      {application.status === "pending" && (
                        <div className="grid grid-cols-2 gap-2">
                          <Form
                            method="post"
                            action={`/client/gigs/${gig.$id}/applications/${application.$id}`}
                          >
                            <input
                              type="hidden"
                              name="_action"
                              value="accept"
                            />
                            <button
                              type="submit"
                              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                            >
                              Accept
                            </button>
                          </Form>
                          <Form
                            method="post"
                            action={`/client/gigs/${gig.$id}/applications/${application.$id}`}
                          >
                            <input
                              type="hidden"
                              name="_action"
                              value="reject"
                            />
                            <button
                              type="submit"
                              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                            >
                              Reject
                            </button>
                          </Form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center">
        <div className="bg-emerald-100 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-emerald-600" />
        </div>
        <div className="ml-4">
          <dt className="text-sm font-medium text-gray-500">{title}</dt>
          <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
        </div>
      </div>
    </div>
  );
}
