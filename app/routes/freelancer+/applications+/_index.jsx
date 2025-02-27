// app/routes/freelancer+/applications+/_index.jsx
import { useState } from "react";
import { useLoaderData, Link } from "@remix-run/react";
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CurrencyBangladeshiIcon,
  UserCircleIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

export async function loader({ request }) {
  const { redirect } = await import("@remix-run/node");
  const { getSession } = await import("../../../utils/session");
  const { getUser } = await import("../../../middleware/database");
  const { createSessionClient, Query } = await import(
    "../../../utils/appwrite"
  );
  const { DATABASE_ID, APPLICATION_COLLECTION } = await import(
    "../../../utils/config"
  );

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
    const freelancer = await getUser(session.get("userId"));

    const applications = await databases.listDocuments(
      DATABASE_ID,
      APPLICATION_COLLECTION,
      [Query.equal("freelancerId", freelancer.$id)]
    );

    const stats = {
      totalApplications: applications.total,
      pending: applications.documents.filter((a) => a.status === "pending")
        .length,
      accepted: applications.documents.filter((a) => a.status === "accepted")
        .length,
      rejected: applications.documents.filter((a) => a.status === "rejected")
        .length,
      withdrawn: applications.documents.filter((a) => a.status === "withdrawn")
        .length,
    };

    return new Response(
      JSON.stringify({ stats, applications: applications.documents }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to load applications" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export default function FreelancerApplications() {
  const { stats, applications } = useLoaderData();
  const [activeFilter, setActiveFilter] = useState("pending");

  const statusStyles = {
    pending: "bg-amber-100 text-amber-800",
    accepted: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-800",
    withdrawn: "bg-gray-100 text-gray-800",
  };

  const filteredApplications = activeFilter
    ? applications.filter((app) => app.status === activeFilter)
    : applications;

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={DocumentTextIcon}
          title="Total Applications"
          value={stats.totalApplications}
        />
        <StatCard
          icon={CheckCircleIcon}
          title="Accepted"
          value={stats.accepted}
        />
        <StatCard icon={ClockIcon} title="Pending" value={stats.pending} />
        <StatCard icon={XCircleIcon} title="Rejected" value={stats.rejected} />
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold">Your Applications</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveFilter(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                !activeFilter
                  ? "bg-purple-100 text-purple-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              All ({stats.totalApplications})
            </button>
            {Object.entries({
              pending: "Pending",
              accepted: "Accepted",
              rejected: "Rejected",
              withdrawn: "Withdrawn",
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

        <div className="space-y-6">
          {filteredApplications.map((application) => (
            <div
              key={application.$id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                {/* Application Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {application.gigId.title}{" "}
                        {/* Assuming populated gig data */}
                      </h3>
                      <div className="flex items-center mt-2 text-gray-600">
                        <CalendarIcon className="h-5 w-5 mr-2 text-emerald-600" />
                        <span>
                          Applied:{" "}
                          {new Date(
                            application.$createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        statusStyles[application.status]
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>

                  {/* Budget and Client Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">
                        Proposed Budget
                      </label>
                      <p className="font-medium">
                        ৳{application.proposedBudget.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Client</label>
                      <div className="flex items-center">
                        <UserCircleIcon className="h-5 w-5 mr-2 text-emerald-600" />
                        <span>{application.clientId.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cover Letter Preview */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Cover Letter</h4>
                    <p className="text-gray-600 line-clamp-2">
                      {application.coverletter}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="md:w-64 space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Actions</h4>
                    <div className="flex flex-col gap-2">
                      <Link
                        to={`/freelancer/applications/${application.$id}`}
                        className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-center"
                      >
                        View Application
                      </Link>
                      {application.status === "pending" && (
                        <button className="w-full px-4 py-2 border border-red-600 text-red-600 hover:bg-red-50 rounded">
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
