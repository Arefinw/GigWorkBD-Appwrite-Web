// app/routes/client+/dashboard.jsx
import { useLoaderData, Link } from "@remix-run/react";
import {
  BriefcaseIcon,
  CurrencyBangladeshiIcon,
  UserGroupIcon,
  CalculatorIcon,
  CalendarIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

export async function loader({ request }) {
  const { redirect } = await import("@remix-run/node");
  const { getSession } = await import("../../utils/session");
  const { getUser } = await import("../../middleware/database");
  const { createSessionClient, Query } = await import("../../utils/appwrite");
  const {
    DATABASE_ID,
    GIG_COLLECTION,
    APPLICATION_COLLECTION,
    USER_COLLECTION,
  } = await import("../../utils/config");

  try {
    const session = await getSession(request.headers.get("Cookie"));

    if (
      !session.get("secret") ||
      !session.get("userId") ||
      !session.get("role")
    ) {
      return redirect("/login");
    }

    const { databases } = await createSessionClient(session.get("secret"));
    const user = await getUser(session.get("userId"));

    // Get all client's gigs
    const gigs = await databases.listDocuments(DATABASE_ID, GIG_COLLECTION, [
      Query.equal("clientId", user.$id),
    ]);

    console.log("gigs", gigs);

    // Get gig IDs for applications query
    const gigIds = await gigs.documents.map((gig) => gig.$id);

    // Get recent applications for these gigs
    const applications =
      gigIds.length > 0
        ? await databases.listDocuments(DATABASE_ID, APPLICATION_COLLECTION, [
            Query.equal("gigId", gigIds),
            Query.orderDesc("$createdAt"),
            Query.limit(5),
          ])
        : { documents: [] };
    console.log("applications", applications);

    // Get application ID for each gig
    const freelancerIds = await applications.documents.map(
      (app) => app.freelancerId
    );

    // Get freelancer documents for each application
    const freelancers =
      freelancerIds.length > 0
        ? await databases.listDocuments(DATABASE_ID, USER_COLLECTION, [
            Query.equal("$id", freelancerIds),
            Query.select([
              "$id",
              "userId",
              "fullName",
              "appliedGigs",
              "skills",
            ]),
          ])
        : { documents: [] };

    console.log("freelancers", freelancers);

    // Calculate dashboard stats
    const stats = {
      totalGigs: gigs.total,
      inProgressGigs: gigs.documents.filter((g) => g.status === "in-progress")
        .length,
      openGigs: gigs.documents.filter((g) => g.status === "open").length,
      totalBudget: gigs.documents.reduce((sum, g) => sum + g.budget, 0),
      avgBudget:
        gigs.total > 0
          ? Math.round(
              gigs.documents.reduce((sum, g) => sum + g.budget, 0) / gigs.total
            )
          : 0,
    };

    return new Response(
      JSON.stringify({
        stats,
        gigs: gigs.documents,
        applications: applications.documents,
        freelancers: freelancers.documents,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "X-Remix-Response": "true",
        },
      }
    );
  } catch (error) {
    console.error("Dashboard loader error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to load dashboard data" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export default function ClientDashboard() {
  const { stats, gigs, applications, freelancers } = useLoaderData();

  // Get open gigs
  const openGigs = gigs.filter((g) => g.status === "open");
  // Derive active projects from raw gigs data
  const inProgressGigs = gigs.filter((g) => g.status === "in-progress");

  return (
    <div className="space-y-8">
      {/* Stats Overview (unchanged) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={BriefcaseIcon}
          title="Total Gigs"
          value={stats.totalGigs}
        />
        <StatCard
          icon={UserGroupIcon}
          title="In-Progress Gigs"
          value={stats.inProgressGigs}
        />
        <StatCard
          icon={CurrencyBangladeshiIcon}
          title="Total Spent"
          value={`৳${stats.totalBudget.toLocaleString()}`}
        />
        <StatCard
          icon={CalculatorIcon}
          title="Avg. Budget"
          value={`৳${stats.avgBudget.toLocaleString()}`}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Open Gigs Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">
            Open Gigs (Seeking Applicants)
          </h2>
          <div className="space-y-4">
            {openGigs.length > 0 ? (
              openGigs.map((gig) => (
                <div
                  key={gig.$id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg">{gig.title}</h3>
                    <span className="text-blue-600">
                      ৳{gig.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      Duration: {gig.duration} months
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <UserGroupIcon className="h-5 w-5" />
                      {gig.applicantsId.length} applicants
                    </div>
                  </div>
                  {/* Add View Details button */}
                  <div className="mt-4 flex justify-end">
                    <Link
                      to={`/client/gigs/${gig.$id}`}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No open gigs available.</p>
            )}
          </div>
        </div>

        {/* In Progress Gigs Section - Repeat same button structure */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">In Progress Gigs</h2>
          <div className="space-y-4">
            {inProgressGigs.length > 0 ? (
              inProgressGigs.map((gig) => (
                <div
                  key={gig.$id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  {/* ... existing gig content ... */}
                  <div className="mt-4 flex justify-end">
                    <Link
                      to={`/client/gigs/${gig.$id}`}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No active projects currently.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Reuse your existing StatCard component
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
