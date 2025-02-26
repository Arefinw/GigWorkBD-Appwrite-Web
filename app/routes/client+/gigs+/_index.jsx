import { useState } from "react";
import { useLoaderData, Link } from "@remix-run/react";
import {
  BriefcaseIcon,
  CurrencyBangladeshiIcon,
  ChartBarIcon,
  CheckCircleIcon,
  CalendarIcon,
  UserGroupIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export async function loader({ request }) {
  const { redirect } = await import("@remix-run/node");
  const { getSession } = await import("../../../utils/session");
  const { getUser } = await import("../../../middleware/database");
  const { createSessionClient, Query } = await import(
    "../../../utils/appwrite"
  );
  const { DATABASE_ID, GIG_COLLECTION } = await import("../../../utils/config");

  try {
    const session = await getSession(request.headers.get("Cookie"));

    if (
      !session.get("secret") ||
      !session.get("userId") ||
      !session.get("role")
    ) {
      return redirect("/login");
    }

    const user = await getUser(session.get("userId"));
    console.log("user", user.$id);

    const { databases } = await createSessionClient(session.get("secret"));
    console.log("databases", databases);
    // Fetch all gigs for this client
    const gigs = await databases.listDocuments(DATABASE_ID, GIG_COLLECTION, [
      Query.equal("clientId", user.$id),
    ]);
    console.log("gigs", gigs);

    // Calculate stats
    const stats = {
      totalGigs: gigs.total,
      openGigs: gigs.documents.filter((g) => g.status === "open").length,
      closedGigs: gigs.documents.filter((g) => g.status === "in-progress")
        .length,
      completedGigs: gigs.documents.filter((g) => g.status === "completed")
        .length,
      cancelledGigs: gigs.documents.filter((g) => g.status === "cancelled")
        .length,
      totalBudget: gigs.documents.reduce((sum, g) => sum + g.budget, 0),
    };
    console.log(stats);

    return new Response(JSON.stringify({ stats, gigs: gigs.documents }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to load gigs" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export default function ClientGigs() {
  const { stats, gigs } = useLoaderData();
  const [activeFilter, setActiveFilter] = useState("open");

  const statusStyles = {
    open: "bg-emerald-100 text-emerald-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
    all: "bg-purple-100 text-purple-800",
  };

  // Filter gigs based on active status
  const filteredGigs = activeFilter
    ? gigs.filter((gig) => gig.status === activeFilter)
    : gigs;

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={BriefcaseIcon}
          title="Total Gigs"
          value={stats.totalGigs}
        />
        <StatCard
          icon={ChartBarIcon}
          title="Open Gigs"
          value={stats.openGigs}
        />
        <StatCard
          icon={CheckCircleIcon}
          title="In Progress"
          value={stats.closedGigs}
        />
        <StatCard
          icon={CurrencyBangladeshiIcon}
          title="Total Budget"
          value={`৳${stats.totalBudget.toLocaleString()}`}
        />
      </div>

      {/* Gigs List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold">Your Gigs</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveFilter(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                !activeFilter ? statusStyles.all : "bg-gray-100 text-gray-800"
              }`}
            >
              All ({stats.totalGigs})
            </button>
            {Object.entries({
              open: "Open",
              "in-progress": "In Progress",
              completed: "Completed",
              cancelled: "Cancelled",
            }).map(([status, label]) => (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  statusStyles[status]
                } ${activeFilter === status ? "ring-2 ring-black" : ""}`}
              >
                {label} (
                {status === "open"
                  ? stats.openGigs
                  : status === "in-progress"
                  ? stats.closedGigs
                  : stats[`${status}Gigs`]}
                )
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {filteredGigs.map((gig) => (
            <div
              key={gig.$id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                {/* Gig Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{gig.title}</h3>
                      <div className="flex items-center mt-2 text-gray-600">
                        <CalendarIcon className="h-5 w-5 mr-2 text-emerald-600" />
                        <span>
                          Posted:{" "}
                          {new Date(gig.$createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        statusStyles[gig.status]
                      }`}
                    >
                      {gig.status}
                    </span>
                  </div>

                  {/* Budget and Duration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Budget</label>
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

                  {/* Skills */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Required Skills</h4>
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

                {/* Actions */}
                <div className="md:w-64 space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Applications</h4>
                    <div className="flex items-center p-2 bg-gray-50 rounded">
                      <UserGroupIcon className="h-5 w-5 text-emerald-600 mr-2" />
                      <span className="text-sm">
                        {gig.applicantsId.length} applicants
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/client/gigs/${gig.$id}`}
                      className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-center"
                    >
                      View Details
                    </Link>
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
