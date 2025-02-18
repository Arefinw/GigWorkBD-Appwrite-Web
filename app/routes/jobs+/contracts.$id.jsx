// app/routes/jobs+/contracts.$id.jsx
import { useLoaderData, Link } from "@remix-run/react";
import {
  DocumentTextIcon,
  CurrencyBangladeshiIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export async function loader({ params }) {
  // Mock data - replace with real API call
  return {
    contract: {
      id: params.id,
      title: "E-commerce Platform Development",
      status: "active",
      client: "Tech Solutions BD",
      freelancer: "John Doe",
      startDate: "2024-02-15",
      endDate: "2024-06-15",
      totalAmount: 1500000,
      amountPaid: 950000,
      milestones: [
        { name: "Design Approval", status: "completed", date: "2024-03-01" },
        {
          name: "Backend Development",
          status: "completed",
          date: "2024-04-15",
        },
        {
          name: "Frontend Implementation",
          status: "current",
          date: "2024-05-01",
        },
        { name: "Final Delivery", status: "pending", date: "2024-06-01" },
      ],
      activities: [
        { date: "2024-05-20", event: "Milestone 3 submitted for review" },
        { date: "2024-05-18", event: "Payment of ৳250,000 released" },
      ],
    },
  };
}

export default function ContractDetails() {
  const { contract } = useLoaderData();
  const progress = Math.round(
    (contract.amountPaid / contract.totalAmount) * 100
  );
  const statusStyles = {
    active: "bg-emerald-100 text-emerald-800",
    completed: "bg-gray-100 text-gray-800",
    pending: "bg-amber-100 text-amber-800",
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

      {/* Contract Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-emerald-600 mr-3" />
              {contract.title}
            </h1>
            <div className="mt-4 flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  statusStyles[contract.status]
                }`}
              >
                {contract.status}
              </span>
              <div className="text-gray-600">
                {new Date(contract.startDate).toLocaleDateString()} -{" "}
                {new Date(contract.endDate).toLocaleDateString()}
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
          title="Total Value"
          value={`৳${contract.totalAmount.toLocaleString()}`}
        />
        <StatCard
          icon={CheckCircleIcon}
          title="Amount Paid"
          value={`৳${contract.amountPaid.toLocaleString()}`}
        />
        <StatCard icon={ChartBarIcon} title="Progress" value={`${progress}%`} />
        <StatCard
          icon={UserGroupIcon}
          title="Parties"
          value={`${contract.client} / ${contract.freelancer}`}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Milestones */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Milestones</h2>
          <div className="space-y-4">
            {contract.milestones.map((milestone, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-4 ${
                      milestone.status === "completed"
                        ? "bg-emerald-500"
                        : milestone.status === "current"
                        ? "bg-amber-500"
                        : "bg-gray-300"
                    }`}
                  />
                  <div>
                    <h3 className="font-medium">{milestone.name}</h3>
                    <p className="text-sm text-gray-500">
                      {milestone.date &&
                        new Date(milestone.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    milestone.status === "completed"
                      ? "bg-emerald-100 text-emerald-800"
                      : milestone.status === "current"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {milestone.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {contract.activities.map((activity, index) => (
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

      {/* Payment Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-medium">Next Payment</h3>
            <p className="text-gray-600">
              ৳{(contract.totalAmount - contract.amountPaid).toLocaleString()}{" "}
              remaining
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="w-full md:w-auto px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
              Release Payment
            </button>
            <button className="w-full md:w-auto px-6 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg">
              Request Changes
            </button>
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
          <dd className="mt-1 text-lg font-semibold text-gray-900 line-clamp-1">
            {value}
          </dd>
        </div>
      </div>
    </div>
  );
}
