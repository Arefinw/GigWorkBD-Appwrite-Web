// app/routes/freelancer+/dashboard.jsx
import { useLoaderData } from "@remix-run/react";
import {
  CurrencyBangladeshiIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export async function loader() {
  // In real app, fetch data from your API
  return {
    stats: {
      earnings: 75000,
      jobSuccess: 95,
      activeContracts: 2,
      pendingProposals: 3,
    },
    recentProposals: [
      { id: 1, project: "E-commerce Site", amount: 25000, status: "pending" },
      { id: 2, project: "Mobile App", amount: 40000, status: "accepted" },
    ],
    suggestedJobs: [
      {
        id: 1,
        title: "Web Development",
        budget: 50000,
        skills: ["React", "Node.js"],
      },
      { id: 2, title: "UI Design", budget: 30000, skills: ["Figma", "UX"] },
    ],
  };
}

export default function FreelancerDashboard() {
  const { stats, recentProposals, suggestedJobs } = useLoaderData();

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Proposals */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Proposals</h2>
          <div className="space-y-4">
            {recentProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{proposal.project}</h3>
                  <p className="text-gray-600">
                    ৳{proposal.amount.toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    proposal.status === "accepted"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {proposal.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Jobs */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <SparklesIcon className="h-6 w-6 text-emerald-600 mr-2" />
            Suggested Jobs
          </h2>
          <div className="space-y-4">
            {suggestedJobs.map((job) => (
              <div
                key={job.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium">{job.title}</h3>
                <div className="mt-2 flex items-center text-emerald-600">
                  <CurrencyBangladeshiIcon className="h-5 w-5 mr-1" />
                  <span>৳{job.budget.toLocaleString()}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
