// app/routes/jobs+/$id/proposals.jsx
import { Link, useLoaderData } from "@remix-run/react";
import {
  UserCircleIcon,
  CurrencyBangladeshiIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  FunnelIcon,
  StarIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export async function loader({ params }) {
  // Mock data - replace with real API calls
  return {
    job: {
      id: params.id,
      title: "Senior React Developer",
      budget: "৳80,000 - ৳120,000",
      location: "Dhaka, Bangladesh",
      skills: ["React", "TypeScript", "Node.js"],
    },
    stats: {
      total: 15,
      average: 95000,
      pending: 12,
      accepted: 1,
      rejected: 2,
    },
    proposals: [
      {
        id: 1,
        freelancer: "John Doe",
        rating: 4.9,
        amount: 110000,
        status: "pending",
        submitted: "2h ago",
        coverLetter: "15+ years experience in React development...",
      },
      {
        id: 2,
        freelancer: "Jane Smith",
        rating: 4.7,
        amount: 95000,
        status: "accepted",
        submitted: "1d ago",
        coverLetter: "Full-stack developer specializing in modern web apps...",
      },
    ],
  };
}

export default function JobProposals() {
  const { job, stats, proposals } = useLoaderData();
  const statusStyles = {
    accepted: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/client/jobs"
          className="flex items-center text-emerald-600 hover:text-emerald-700"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Jobs
        </Link>
      </div>

      {/* Job Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold flex items-center">
          <DocumentTextIcon className="h-8 w-8 text-emerald-600 mr-3" />
          {job.title}
        </h1>
        <div className="mt-2 text-gray-600">
          {job.location} • {job.budget}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={UserCircleIcon}
          title="Total Proposals"
          value={stats.total}
        />
        <StatCard
          icon={CurrencyBangladeshiIcon}
          title="Avg. Proposal"
          value={`৳${stats.average.toLocaleString()}`}
        />
        <StatCard icon={ClockIcon} title="Pending" value={stats.pending} />
        <StatCard
          icon={ChartBarIcon}
          title="Response Rate"
          value={`${Math.round((stats.accepted / stats.total) * 100)}%`}
        />
      </div>

      {/* Proposals List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold">All Proposals</h2>
          <div className="flex gap-2">
            <button className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg">
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filter
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                {/* Proposal Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium">
                        {proposal.freelancer}
                      </h3>
                      <div className="flex items-center mt-1 text-gray-600">
                        <StarIcon className="h-4 w-4 text-amber-400 mr-1" />
                        <span>{proposal.rating}</span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        statusStyles[proposal.status]
                      }`}
                    >
                      {proposal.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-emerald-600">
                      <CurrencyBangladeshiIcon className="h-5 w-5 mr-1" />
                      <span className="font-medium">
                        ৳{proposal.amount.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-gray-500">•</span>
                    <div className="text-gray-600">
                      Submitted {proposal.submitted}
                    </div>
                  </div>

                  <p className="text-gray-600 line-clamp-2">
                    {proposal.coverLetter}
                  </p>
                </div>

                {/* Actions */}
                <div className="md:w-48 space-y-4">
                  <div className="flex gap-2">
                    {proposal.status === "pending" ? (
                      <>
                        <button className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded">
                          Accept
                        </button>
                        <button className="px-4 py-2 border border-red-600 text-red-600 hover:bg-red-50 rounded">
                          Reject
                        </button>
                      </>
                    ) : (
                      <button className="w-full px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded">
                        Message
                      </button>
                    )}
                  </div>
                  <button className="w-full text-emerald-600 hover:text-emerald-700 text-sm">
                    View Full Proposal
                  </button>
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
