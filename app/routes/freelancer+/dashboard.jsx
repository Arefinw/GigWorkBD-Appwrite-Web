// app/routes/freelancer+/dashboard.jsx
import { useLoaderData, Link } from "@remix-run/react";
import {
  CurrencyBangladeshiIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  ClockIcon,
  DocumentTextIcon,
  UserGroupIcon,
  XCircleIcon,
  SparklesIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

export async function loader({ request }) {
  const { redirect } = await import("@remix-run/node");
  const { getSession } = await import("../../utils/session");
  const { createSessionClient, Query } = await import("../../utils/appwrite");
  const { getUser } = await import("../../middleware/database");
  const {
    DATABASE_ID,
    GIG_COLLECTION,
    APPLICATION_COLLECTION,
    CONTRACT_COLLECTION,
  } = await import("../../utils/config");

  const session = await getSession(request.headers.get("Cookie"));

  if (!session.get("secret") || session.get("role") !== "freelancer") {
    return redirect("/login");
  }

  try {
    const { databases } = await createSessionClient(session.get("secret"));
    const freelancer = await getUser(session.get("userId"));

    // Fetch all freelancer proposals
    const proposals = await databases.listDocuments(
      DATABASE_ID,
      APPLICATION_COLLECTION,
      [Query.equal("freelancerId", freelancer.$id)]
    );

    // Extract gig IDs from proposals
    const gigIds = proposals.documents.map((p) => p.gigId).filter((id) => id); // Remove undefined/null

    // Fetch related data in parallel
    const [gigs, contracts, suggestedJobs] = await Promise.all([
      gigIds.length > 0
        ? databases.listDocuments(DATABASE_ID, GIG_COLLECTION, [
            Query.equal("$id", gigIds),
          ])
        : { documents: [] },
      databases.listDocuments(DATABASE_ID, CONTRACT_COLLECTION, [
        Query.equal("freelancerId", freelancer.$id),
        Query.equal("status", "active"),
      ]),
      databases.listDocuments(DATABASE_ID, GIG_COLLECTION, [
        Query.equal("status", "open"),
        Query.orderDesc("$createdAt"),
        Query.limit(5),
      ]),
    ]);

    // Create gig map for quick lookups
    const gigMap = new Map(gigs.documents.map((g) => [g.$id, g]));

    // Enhance proposals with gig data
    const enhancedProposals = proposals.documents.map((p) => ({
      ...p,
      gig: gigMap.get(p.gigId) || null,
    }));

    // Calculate stats
    const acceptedProposals = enhancedProposals.filter(
      (p) => p.status === "accepted"
    );
    const stats = {
      earnings: acceptedProposals.reduce(
        (sum, p) => sum + (p.proposedBudget || 0),
        0
      ),
      jobSuccess:
        proposals.total > 0
          ? Math.round((acceptedProposals.length / proposals.total) * 100)
          : 0,
      activeContracts: contracts.total,
      pendingProposals: enhancedProposals.filter((p) => p.status === "pending")
        .length,
      withdrawnProposals: enhancedProposals.filter(
        (p) => p.status === "withdrawn"
      ).length,
    };

    return {
      stats,
      proposals: enhancedProposals,
      contracts: contracts.documents,
      suggestedJobs: suggestedJobs.documents,
    };
  } catch (error) {
    console.error("Dashboard error:", error);
    throw new Response("Failed to load dashboard", { status: 500 });
  }
}

export default function FreelancerDashboard() {
  const { stats, proposals, contracts, suggestedJobs } = useLoaderData();

  // Filter proposals
  const pendingProposals = proposals.filter((p) => p.status === "pending");
  const withdrawnProposals = proposals.filter((p) => p.status === "withdrawn");

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={CurrencyBangladeshiIcon}
          title="Total Earnings"
          value={`৳${stats.earnings.toLocaleString()}`}
        />
        <StatCard
          icon={CheckCircleIcon}
          title="Job Success"
          value={`${stats.jobSuccess}%`}
        />
        <StatCard
          icon={BriefcaseIcon}
          title="Active Contracts"
          value={stats.activeContracts}
        />
        <StatCard
          icon={ClockIcon}
          title="Pending Proposals"
          value={stats.pendingProposals}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Contracts */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center">
            <DocumentTextIcon className="h-6 w-6 mr-2 text-emerald-600" />
            Active Contracts
          </h2>
          <div className="space-y-4">
            {contracts.length > 0 ? (
              contracts.map((contract) => (
                <ContractCard key={contract.$id} contract={contract} />
              ))
            ) : (
              <p className="text-gray-500">No active contracts</p>
            )}
          </div>
        </div>

        {/* Pending Proposals */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center">
            <SparklesIcon className="h-6 w-6 mr-2 text-emerald-600" />
            Pending Proposals
          </h2>
          <div className="space-y-4">
            {pendingProposals.length > 0 ? (
              pendingProposals.map((proposal) => (
                <ProposalCard key={proposal.$id} proposal={proposal} />
              ))
            ) : (
              <p className="text-gray-500">No pending proposals</p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Withdrawn Proposals */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center">
            <XCircleIcon className="h-6 w-6 mr-2 text-red-600" />
            Withdrawn Proposals
          </h2>
          <div className="space-y-4">
            {withdrawnProposals.length > 0 ? (
              withdrawnProposals.map((proposal) => (
                <ProposalCard key={proposal.$id} proposal={proposal} />
              ))
            ) : (
              <p className="text-gray-500">No withdrawn proposals</p>
            )}
          </div>
        </div>

        {/* Suggested Jobs */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center">
            <SparklesIcon className="h-6 w-6 mr-2 text-emerald-600" />
            Suggested Jobs
          </h2>
          <div className="space-y-4">
            {suggestedJobs.length > 0 ? (
              suggestedJobs.map((job) => <JobCard key={job.$id} job={job} />)
            ) : (
              <p className="text-gray-500">No suggested jobs available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Component Sub-components
function ProposalCard({ proposal }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">
            {proposal.gig?.title || "Untitled Gig"}
          </h3>
          <div className="mt-1 text-emerald-600">
            <span>৳{proposal.proposedBudget?.toLocaleString()}</span>
            {proposal.gig?.budget && (
              <span className="ml-2 text-sm text-gray-500">
                (Gig Budget: ৳{proposal.gig.budget.toLocaleString()})
              </span>
            )}
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            proposal.status === "accepted"
              ? "bg-emerald-100 text-emerald-800"
              : proposal.status === "pending"
              ? "bg-amber-100 text-amber-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {proposal.status}
        </span>
      </div>

      {proposal.gig && (
        <div className="mt-4 text-sm text-gray-500 space-y-2">
          <div className="flex items-center gap-2">
            <UserGroupIcon className="h-5 w-5" />
            <span>{proposal.gig.applicantsId?.length || 0} applicants</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <span>
              Posted: {new Date(proposal.gig.$createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-end gap-2">
        {proposal.gigId && (
          <Link
            to={`/freelancer/gigs/${proposal.gigId}`}
            className="px-3 py-1.5 border border-emerald-600 text-emerald-600 rounded text-sm hover:bg-emerald-50 transition-colors"
          >
            View Gig
          </Link>
        )}
        <Link
          to={`/freelancer/applications/${proposal.$id}`}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

function ContractCard({ contract }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg">
          {contract.gigId?.title || "Active Contract"}
        </h3>
        <span className="text-blue-600">
          ৳{contract.value?.toLocaleString()}
        </span>
      </div>
      <div className="mt-4 text-sm text-gray-500 space-y-2">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          <span>
            Started: {new Date(contract.startDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircleIcon className="h-5 w-5" />
          <span>Status: {contract.status}</span>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Link
          to={`/freelancer/contracts/${contract.$id}`}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm transition-colors"
        >
          View Contract
        </Link>
      </div>
    </div>
  );
}

function JobCard({ job }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg">{job.title}</h3>
        <span className="text-emerald-600">
          ৳{job.budget?.toLocaleString()}
        </span>
      </div>
      <div className="mt-4 text-sm text-gray-500 space-y-2">
        <div className="flex items-center gap-2">
          <UserGroupIcon className="h-5 w-5" />
          <span>{job.applicantsId?.length || 0} applicants</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          <span>Posted: {new Date(job.$createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {job.requiredSkills?.map((skill) => (
          <span
            key={skill}
            className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <Link
          to={`/freelancer/gigs/${job.$id}`}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm transition-colors"
        >
          View Gig
        </Link>
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
