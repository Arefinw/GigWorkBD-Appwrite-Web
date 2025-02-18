// app/routes/client+/contracts.jsx
import { useLoaderData } from "@remix-run/react";
import {
  DocumentTextIcon,
  CheckCircleIcon,
  CurrencyBangladeshiIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

export async function loader() {
  // Mock data - replace with real API calls
  return {
    stats: {
      total: 8,
      active: 3,
      completed: 5,
      totalSpent: 2250000,
    },
    contracts: [
      {
        id: 1,
        title: "E-commerce Platform Development",
        status: "active",
        freelancers: ["John Doe", "Jane Smith"],
        budget: 1500000,
        paid: 950000,
        startDate: "2024-02-15",
        endDate: "2024-06-15",
        progress: 63,
        milestones: [
          { name: "Design Approval", status: "completed" },
          { name: "Backend Development", status: "completed" },
          { name: "Frontend Implementation", status: "current" },
        ],
      },
      {
        id: 2,
        title: "Mobile App UI Design",
        status: "completed",
        freelancers: ["Alex Johnson"],
        budget: 750000,
        paid: 750000,
        startDate: "2024-01-10",
        endDate: "2024-03-10",
        progress: 100,
        milestones: [
          { name: "Wireframes", status: "completed" },
          { name: "Visual Design", status: "completed" },
        ],
      },
    ],
  };
}

export default function ClientContracts() {
  const { stats, contracts } = useLoaderData();
  const statusStyles = {
    active: "bg-emerald-100 text-emerald-800",
    completed: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={DocumentTextIcon}
          title="Total Contracts"
          value={stats.total}
        />
        <StatCard icon={ChartBarIcon} title="Active" value={stats.active} />
        <StatCard
          icon={CheckCircleIcon}
          title="Completed"
          value={stats.completed}
        />
        <StatCard
          icon={CurrencyBangladeshiIcon}
          title="Total Spent"
          value={`৳${stats.totalSpent.toLocaleString()}`}
        />
      </div>

      {/* Contracts List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold">Active Contracts</h2>
          <div className="flex gap-2">
            {Object.keys(statusStyles).map((status) => (
              <button
                key={status}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${statusStyles[status]}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                {/* Contract Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {contract.title}
                      </h3>
                      <div className="flex items-center mt-2 text-gray-600">
                        <UserGroupIcon className="h-5 w-5 mr-2 text-emerald-600" />
                        <span>{contract.freelancers.join(", ")}</span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        statusStyles[contract.status]
                      }`}
                    >
                      {contract.status}
                    </span>
                  </div>

                  {/* Progress Section */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{contract.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{ width: `${contract.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Financial Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">
                        Total Budget
                      </label>
                      <p className="font-medium">
                        ৳{contract.budget.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">
                        Amount Paid
                      </label>
                      <p className="font-medium">
                        ৳{contract.paid.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-5 w-5 mr-2 text-emerald-600" />
                    {new Date(contract.startDate).toLocaleDateString()} -{" "}
                    {new Date(contract.endDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Milestones and Actions */}
                <div className="md:w-96 space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Milestones</h4>
                    <div className="space-y-2">
                      {contract.milestones.map((milestone, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm">{milestone.name}</span>
                          <span
                            className={`text-sm ${
                              milestone.status === "completed"
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          >
                            {milestone.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded">
                      Release Payment
                    </button>
                    <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded">
                      Details
                    </button>
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
