// app/routes/jobs+/milestones.$id.jsx
import { useLoaderData, Link } from "@remix-run/react";
import {
  CheckCircleIcon,
  CurrencyBangladeshiIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export async function loader({ params }) {
  // Mock data - replace with real API call
  return {
    milestone: {
      id: params.id,
      title: "Frontend Implementation",
      status: "in-progress",
      dueDate: "2024-05-30",
      contract: {
        title: "E-commerce Platform Development",
        client: "Tech Solutions BD",
        freelancer: "John Doe",
      },
      amount: 500000,
      paid: 250000,
      description:
        "Implement responsive frontend using React and Tailwind CSS based on approved designs",
      activities: [
        { date: "2024-05-20", event: "Initial prototype submitted" },
        { date: "2024-05-18", event: "50% payment released" },
      ],
    },
  };
}

export default function MilestoneDetails() {
  const { milestone } = useLoaderData();
  const progress = Math.round((milestone.paid / milestone.amount) * 100);
  const statusStyles = {
    completed: "bg-emerald-100 text-emerald-800",
    "in-progress": "bg-amber-100 text-amber-800",
    pending: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <Link
        to="/contracts"
        className="flex items-center text-emerald-600 hover:text-emerald-700"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Contracts
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-emerald-600 mr-3" />
              {milestone.title}
            </h1>
            <div className="mt-4 flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  statusStyles[milestone.status]
                }`}
              >
                {milestone.status.replace("-", " ")}
              </span>
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Due {new Date(milestone.dueDate).toLocaleDateString()}
              </div>
            </div>
          </div>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
            View Contract
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={CurrencyBangladeshiIcon}
          title="Milestone Value"
          value={`৳${milestone.amount.toLocaleString()}`}
        />
        <StatCard
          icon={CheckCircleIcon}
          title="Amount Paid"
          value={`৳${milestone.paid.toLocaleString()}`}
        />
        <StatCard
          icon={ChartBarIcon}
          title="Payment Progress"
          value={`${progress}%`}
        />
        <StatCard
          icon={UserGroupIcon}
          title="Parties"
          value={`${milestone.contract.client} / ${milestone.contract.freelancer}`}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Details Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">
              {milestone.description}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Value:</span>
                <span className="font-medium">
                  ৳{milestone.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="text-emerald-600">
                  ৳{milestone.paid.toLocaleString()}
                </span>
              </div>
              <div className="pt-4">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-emerald-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {milestone.activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start border-l-4 border-emerald-500 pl-4"
              >
                <div className="flex-1">
                  <p className="text-gray-600">{activity.event}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-end">
          {milestone.status === "in-progress" && (
            <>
              <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
                Submit Work
              </button>
              <button className="px-6 py-2 border border-amber-600 text-amber-600 hover:bg-amber-50 rounded-lg">
                Request Revision
              </button>
            </>
          )}
          <button className="px-6 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg">
            Message Client
          </button>
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
          <dd className="mt-1 text-lg font-semibold text-gray-900 line-clamp-1">
            {value}
          </dd>
        </div>
      </div>
    </div>
  );
}
