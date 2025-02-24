// app/routes/freelancer+/applications+/_index.jsx
import { useLoaderData } from "@remix-run/react";
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CurrencyBangladeshiIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export async function loader() {
  // Mock data - replace with real API calls
  return {
    stats: {
      total: 15,
      accepted: 9,
      pending: 4,
      rejected: 2,
    },
    proposals: [
      {
        id: 1,
        jobTitle: "E-commerce Website Development",
        status: "accepted",
        date: "2024-03-15",
        proposedAmount: 45000,
        client: {
          name: "Tech Solutions BD",
          rating: 4.8,
        },
        jobPosted: "5 days ago",
      },
      {
        id: 2,
        jobTitle: "Mobile App UI Design",
        status: "pending",
        date: "2024-03-18",
        proposedAmount: 30000,
        client: {
          name: "Design Innovators",
          rating: 4.5,
        },
        jobPosted: "2 days ago",
      },
      // Add more proposals
    ],
  };
}

export default function FreelancerProposals() {
  const { stats, proposals } = useLoaderData();

  const statusStyles = {
    accepted: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={DocumentTextIcon}
          title="Total Proposals"
          value={stats.total}
        />
        <StatCard
          icon={CheckCircleIcon}
          title="Accepted"
          value={stats.accepted}
          percentage={(stats.accepted / stats.total) * 100}
        />
        <StatCard
          icon={ClockIcon}
          title="Pending"
          value={stats.pending}
          percentage={(stats.pending / stats.total) * 100}
        />
        <StatCard
          icon={XCircleIcon}
          title="Rejected"
          value={stats.rejected}
          percentage={(stats.rejected / stats.total) * 100}
        />
      </div>

      {/* Proposals List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Recent Proposals</h2>

        {/* Status Filters */}
        <div className="flex gap-2 mb-6">
          {Object.keys(statusStyles).map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${statusStyles[status]}`}
            >
              {status} ({stats[status]})
            </button>
          ))}
        </div>

        {/* Proposals Table */}
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Proposal Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">
                    {proposal.jobTitle}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center">
                      <UserCircleIcon className="h-5 w-5 mr-2 text-emerald-600" />
                      <span>{proposal.client.name}</span>
                      <span className="ml-2 text-emerald-600">
                        ★ {proposal.client.rating}
                      </span>
                    </div>
                    <span className="hidden md:block">•</span>
                    <div className="flex items-center">
                      <CurrencyBangladeshiIcon className="h-5 w-5 mr-2 text-emerald-600" />
                      <span>৳{proposal.proposedAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="md:text-right space-y-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      statusStyles[proposal.status]
                    }`}
                  >
                    {proposal.status}
                  </span>
                  <div className="text-sm text-gray-500">
                    Proposed {proposal.date}
                  </div>
                  <div className="mt-2 space-x-3">
                    <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                      View Job
                    </button>
                    {proposal.status === "pending" && (
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                        Withdraw
                      </button>
                    )}
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

function StatCard({ icon: Icon, title, value, percentage }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center">
        <div className="bg-emerald-100 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-emerald-600" />
        </div>
        <div className="ml-4">
          <dt className="text-sm font-medium text-gray-500">{title}</dt>
          <dd className="mt-1 text-2xl font-semibold text-gray-900">
            {value}
            {percentage && (
              <span className="ml-2 text-sm text-emerald-600">
                ({percentage.toFixed(1)}%)
              </span>
            )}
          </dd>
        </div>
      </div>
    </div>
  );
}
