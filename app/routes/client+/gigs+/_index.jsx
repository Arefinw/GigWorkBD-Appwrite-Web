// app/routes/client+/gigs+/_index.jsx
import { useState } from "react";
import { useLoaderData, Link } from "@remix-run/react";
import {
  BriefcaseIcon,
  CurrencyBangladeshiIcon,
  ChartBarIcon,
  CheckCircleIcon,
  CalendarIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export async function loader({ request }) {
  const { redirect } = await import("@remix-run/node");
  const { getSession } = await import("../../../utils/session");
  const { createSessionClient, Query } = await import(
    "../../../utils/appwrite"
  );
  const { DATABASE_ID, GIG_COLLECTION } = await import("../../../utils/config");
  const { getUser } = await import("../../../middleware/database");
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
    // Get Client Document
    const client = await getUser(session.get("userId"));
    // Fetch all gigs for this client
    const gigs = await databases.listDocuments(DATABASE_ID, GIG_COLLECTION, [
      Query.equal("clientId", client.$id),
    ]);
    console.log("gigs", gigs);

    // Calculate stats
    const stats = {
      totalGigs: gigs.total,
      openGigs: gigs.documents.filter((g) => g.status === "open").length,
      inProgressGigs: gigs.documents.filter((g) => g.status === "in-progress")
        .length,
      completedGigs: gigs.documents.filter((g) => g.status === "completed")
        .length,
      withdrawnGigs: gigs.documents.filter((g) => g.status === "withdrawn")
        .length, // Add this line
      totalBudget: gigs.documents
        .filter((gig) => gig.status !== "withdrawn")
        .reduce((sum, g) => sum + g.budget, 0),
    };
    return { stats, gigs: gigs.documents };
  } catch (error) {
    console.error("Error fetching client gigs:", error);
    return { error: "Failed to load gigs" };
  }
}

export default function ClientGigs() {
  const { stats, gigs } = useLoaderData();
  const [activeFilter, setActiveFilter] = useState("open");

  const statusConfig = {
    open: { label: "Open", color: "bg-green-100 text-green-800" },
    "in-progress": { label: "In Progress", color: "bg-blue-100 text-blue-800" },
    completed: { label: "Completed", color: "bg-purple-100 text-purple-800" },
    withdrawn: { label: "Withdrawn", color: "bg-gray-100 text-gray-800" },
  };

  const filteredGigs = activeFilter
    ? gigs.filter((gig) => gig.status === activeFilter)
    : gigs;

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={BriefcaseIcon}
          title="Total Gigs"
          value={stats.totalGigs}
        />
        <StatCard
          icon={CheckCircleIcon}
          title="Open Gigs"
          value={stats.openGigs}
          color="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          icon={ChartBarIcon}
          title="In Progress"
          value={stats.inProgressGigs}
          color="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={CurrencyBangladeshiIcon}
          title="Total Budget"
          value={`৳${stats.totalBudget.toLocaleString()}`}
        />
      </div>

      {/* Status Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold">Your Gigs</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                !activeFilter
                  ? "bg-purple-100 text-purple-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              All ({stats.totalGigs})
            </button>
            {Object.entries(statusConfig).map(([status, config]) => (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  config.color
                } ${activeFilter === status ? "ring-2 ring-black" : ""}`}
              >
                {config.label} (
                {status === "withdrawn"
                  ? stats.withdrawnGigs
                  : stats[`${status.replace("-", "")}Gigs`] || 0}
                )
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gig Listings */}
      <div className="space-y-6">
        {filteredGigs.map((gig) => (
          <div
            key={gig.$id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              {/* Gig Details */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{gig.title}</h3>
                  <span
                    className={`px-2 py-1 text-sm rounded-full capitalize ${
                      statusConfig[gig.status].color
                    }`}
                  >
                    {statusConfig[gig.status].label}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <CurrencyBangladeshiIcon className="h-5 w-5 mr-1 text-emerald-600" />
                    <span className="font-medium">
                      ৳{gig.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserGroupIcon className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm">
                      {gig.status === "withdrawn" ? 0 : gig.applicantsId.length}{" "}
                      applicants
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {gig.requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>

                <div className="text-sm text-gray-500 space-y-1">
                  <p className="line-clamp-2">{gig.description}</p>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      Posted: {new Date(gig.$createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>Duration: {gig.duration} months</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="md:text-right min-w-[120px]">
                <Link
                  to={`/client/gigs/${gig.$id}`}
                  className="inline-block w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors text-center"
                >
                  Manage Gig
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
  color = "bg-emerald-100",
  iconColor = "text-emerald-600",
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center">
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div className="ml-4">
          <dt className="text-sm font-medium text-gray-500">{title}</dt>
          <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
        </div>
      </div>
    </div>
  );
}
