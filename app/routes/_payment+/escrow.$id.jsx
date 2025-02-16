import { useLoaderData, Link } from "@remix-run/react";
import {
  CurrencyBangladeshiIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export async function loader({ params }) {
  // Mock data - replace with real API call
  return {
    escrow: {
      id: params.id,
      title: "E-commerce Platform Development",
      status: "active",
      amount: 1500000,
      released: 750000,
      fee: 15000,
      created: "2024-02-15",
      parties: {
        client: "Tech Solutions BD",
        freelancer: "John Doe",
      },
      milestones: [
        { name: "Design Approval", released: true, amount: 250000 },
        { name: "Backend Development", released: true, amount: 500000 },
        { name: "Frontend Implementation", released: false, amount: 750000 },
      ],
      activity: [
        { date: "2024-05-20", event: "Frontend milestone submitted" },
        { date: "2024-05-18", event: "৳500,000 released" },
      ],
    },
  };
}

export default function EscrowDetails() {
  const { escrow } = useLoaderData();
  const progress = Math.round((escrow.released / escrow.amount) * 100);
  const statusStyles = {
    active: "bg-emerald-100 text-emerald-800",
    completed: "bg-gray-100 text-gray-800",
    disputed: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <Link
        to="/escrow"
        className="flex items-center text-emerald-600 hover:text-emerald-700"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Escrow
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <ShieldCheckIcon className="h-8 w-8 text-emerald-600 mr-3" />
              {escrow.title}
            </h1>
            <div className="mt-4 flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  statusStyles[escrow.status]
                }`}
              >
                {escrow.status}
              </span>
              <div className="text-gray-600">
                Created {new Date(escrow.created).toLocaleDateString()}
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
          title="Total Amount"
          value={`৳${escrow.amount.toLocaleString()}`}
        />
        <StatCard
          icon={CheckCircleIcon}
          title="Released Funds"
          value={`৳${escrow.released.toLocaleString()}`}
        />
        <StatCard icon={ChartBarIcon} title="Progress" value={`${progress}%`} />
        <StatCard
          icon={UserGroupIcon}
          title="Parties"
          value={`${escrow.parties.client} / ${escrow.parties.freelancer}`}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Milestones */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Milestones</h2>
          <div className="space-y-4">
            {escrow.milestones.map((milestone, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center">
                  {milestone.released ? (
                    <CheckCircleIcon className="h-6 w-6 text-emerald-600 mr-4" />
                  ) : (
                    <ClockIcon className="h-6 w-6 text-amber-600 mr-4" />
                  )}
                  <div>
                    <h3 className="font-medium">{milestone.name}</h3>
                    <p className="text-sm text-gray-500">
                      ৳{milestone.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm ${
                    milestone.released ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {milestone.released ? "Released" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Escrow Activity</h2>
          <div className="space-y-4">
            {escrow.activity.map((activity, index) => (
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

      {/* Action Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-medium">Next Milestone</h3>
            <p className="text-gray-600">
              ৳{(escrow.amount - escrow.released).toLocaleString()} remaining
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="w-full md:w-auto px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
              Release Funds
            </button>
            <button className="w-full md:w-auto px-6 py-2 border border-amber-600 text-amber-600 hover:bg-amber-50 rounded-lg">
              Raise Dispute
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
