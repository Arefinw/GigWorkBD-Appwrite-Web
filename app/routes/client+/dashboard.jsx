// app/routes/client+/dashboard.jsx
import { useLoaderData } from "@remix-run/react";
import {
  BriefcaseIcon,
  CurrencyBangladeshiIcon,
  CalculatorIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  DocumentTextIcon,
  StarIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export async function loader() {
  // Mock data - replace with real API calls
  return {
    stats: {
      totalProjects: 15,
      activeProjects: 3,
      totalSpent: 1250000,
      avgProjectBudget: 85000,
    },
    activeProjects: [
      {
        id: 1,
        title: "E-commerce Platform Development",
        progress: 65,
        deadline: "2024-06-15",
        budget: 150000,
        milestones: [
          "Design Approved",
          "Backend Development",
          "Frontend Implementation",
        ],
      },
      {
        id: 2,
        title: "Mobile App UI/UX Design",
        progress: 30,
        deadline: "2024-05-30",
        budget: 75000,
        milestones: ["Wireframes Approved", "Visual Design"],
      },
    ],
    recentProposals: [
      {
        id: 1,
        freelancer: "John Doe",
        rating: 4.9,
        amount: 45000,
        status: "pending",
        submitted: "2h ago",
      },
      {
        id: 2,
        freelancer: "Jane Smith",
        rating: 4.7,
        amount: 38000,
        status: "accepted",
        submitted: "1d ago",
      },
    ],
    spendingData: [
      { month: "Jan", amount: 25000 },
      { month: "Feb", amount: 45000 },
      { month: "Mar", amount: 65000 },
      { month: "Apr", amount: 35000 },
      { month: "May", amount: 85000 },
    ],
  };
}

export default function ClientDashboard() {
  const { stats, activeProjects, recentProposals, spendingData } =
    useLoaderData();

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={BriefcaseIcon}
          title="Total Projects"
          value={stats.totalProjects}
        />
        <StatCard
          icon={UserGroupIcon}
          title="Active Projects"
          value={stats.activeProjects}
        />
        <StatCard
          icon={CurrencyBangladeshiIcon}
          title="Total Spent"
          value={`৳${stats.totalSpent.toLocaleString()}`}
        />
        <StatCard
          icon={CalculatorIcon}
          title="Avg. Budget"
          value={`৳${stats.avgProjectBudget.toLocaleString()}`}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Projects */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Active Projects</h2>
          <div className="space-y-4">
            {activeProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg">{project.title}</h3>
                  <span className="text-emerald-600">
                    ৳{project.budget.toLocaleString()}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Milestones */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Milestones</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.milestones.map((milestone, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm"
                      >
                        {milestone}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  Deadline: {new Date(project.deadline).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Recent Proposals */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Proposals</h2>
            <div className="space-y-4">
              {recentProposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{proposal.freelancer}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <StarIcon className="h-4 w-4 text-amber-400 mr-1" />
                        {proposal.rating}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        proposal.status === "accepted"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {proposal.status}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-emerald-600">
                      ৳{proposal.amount.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {proposal.submitted}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spending Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Spending Overview</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spendingData}>
                  <XAxis
                    dataKey="month"
                    stroke="#059669"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#059669"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => `৳${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{ border: "none", borderRadius: "8px" }}
                    formatter={(value) => [
                      `৳${value.toLocaleString()}`,
                      "Amount",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#059669"
                    strokeWidth={2}
                    dot={{ fill: "#059669", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
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
