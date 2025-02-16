import { useLoaderData, Link } from "@remix-run/react";
import {
  UserCircleIcon,
  StarIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export async function loader({ params }) {
  // Mock data - replace with real API call using params.jobId
  return {
    job: {
      id: params.jobId,
      title: "E-commerce Platform Developer",
      budget: "৳150,000",
      posted: "2024-05-01",
    },
    applicants: [
      {
        id: 1,
        name: "John Doe",
        rating: 4.9,
        proposal: "15+ years experience in React and Node.js development",
        status: "pending",
        applied: "2 days ago",
        matches: 95,
      },
      {
        id: 2,
        name: "Jane Smith",
        rating: 4.7,
        proposal: "Full-stack developer specializing in e-commerce solutions",
        status: "accepted",
        applied: "3 days ago",
        matches: 89,
      },
    ],
    stats: {
      total: 15,
      accepted: 2,
      pending: 12,
      rejected: 1,
      avgRating: 4.5,
    },
    timeline: [
      { date: "2024-05-01", count: 2 },
      { date: "2024-05-02", count: 5 },
      { date: "2024-05-03", count: 8 },
    ],
  };
}

export default function JobApplicants() {
  const { job, applicants, stats, timeline } = useLoaderData();
  const statusStyles = {
    accepted: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Link
          to="/client/jobs"
          className="flex items-center text-emerald-600 hover:text-emerald-700"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Jobs
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-emerald-600 mr-3" />
              {job.title}
            </h1>
            <div className="mt-2 text-gray-600">
              Posted {new Date(job.posted).toLocaleDateString()} • Budget:{" "}
              {job.budget}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={UserCircleIcon}
          title="Total Applicants"
          value={stats.total}
        />
        <StatCard icon={StarIcon} title="Avg. Rating" value={stats.avgRating} />
        <StatCard
          icon={CheckCircleIcon}
          title="Accepted"
          value={stats.accepted}
        />
        <StatCard icon={ClockIcon} title="Pending" value={stats.pending} />
      </div>

      {/* Applicants Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Applications Timeline</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeline}>
              <XAxis
                dataKey="date"
                stroke="#059669"
                fontSize={12}
                tickLine={false}
              />
              <YAxis stroke="#059669" fontSize={12} tickLine={false} />
              <Tooltip contentStyle={{ border: "none", borderRadius: "8px" }} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#059669"
                strokeWidth={2}
                dot={{ fill: "#059669", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Applicants List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">All Applicants</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600 border-b">
                <th className="pb-4">Freelancer</th>
                <th className="pb-4">Match</th>
                <th className="pb-4">Proposal</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {applicants.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-gray-50">
                  <td className="py-4">
                    <div className="flex items-center">
                      <UserCircleIcon className="h-10 w-10 text-gray-400 mr-4" />
                      <div>
                        <div className="font-medium">{applicant.name}</div>
                        <div className="flex items-center text-sm text-gray-600">
                          <StarIcon className="h-4 w-4 text-amber-400 mr-1" />
                          {applicant.rating}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <ChartBarIcon className="h-5 w-5 text-emerald-600 mr-2" />
                      {applicant.matches}%
                    </div>
                  </td>
                  <td className="py-4 max-w-xs">
                    <div className="text-sm text-gray-600 line-clamp-2">
                      {applicant.proposal}
                    </div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        statusStyles[applicant.status]
                      }`}
                    >
                      {applicant.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      {applicant.status === "pending" ? (
                        <>
                          <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm">
                            Accept
                          </button>
                          <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm">
                            Reject
                          </button>
                        </>
                      ) : (
                        <button className="px-3 py-1 border border-gray-300 hover:bg-gray-50 rounded text-sm">
                          Message
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
