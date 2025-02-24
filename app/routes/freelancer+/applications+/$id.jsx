// app/routes/freelancer+/proposals.$id.jsx
import { useLoaderData, Link } from "@remix-run/react";
import {
  DocumentTextIcon,
  ClockIcon,
  CurrencyBangladeshiIcon,
  UserCircleIcon,
  ChartBarIcon,
  PencilIcon,
  XCircleIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

export async function loader({ params }) {
  // Mock data - replace with real API call using params.id
  const proposal = {
    id: params.id,
    jobTitle: "E-commerce Website Development",
    status: "pending",
    dateSubmitted: "2024-03-18",
    proposedAmount: 45000,
    estimatedTime: "3 weeks",
    coverLetter: `I'm excited to submit my proposal for your e-commerce project. With 5 years of experience in React and Node.js development, I've successfully delivered similar projects including...`,
    client: {
      name: "Tech Solutions BD",
      rating: 4.8,
      location: "Dhaka, Bangladesh",
      memberSince: "2022",
      totalSpent: "৳2,500,000",
    },
    jobDetails: {
      budgetRange: "৳30,000 - ৳60,000",
      posted: "5 days ago",
      proposalsReceived: 12,
      skillsRequired: [
        "React",
        "Node.js",
        "MongoDB",
        "Payment Gateway Integration",
      ],
    },
    timeline: [
      { date: "2024-03-18", event: "Proposal submitted" },
      { date: "2024-03-19", event: "Viewed by client" },
    ],
  };

  return { proposal };
}

export default function ProposalDetails() {
  const { proposal } = useLoaderData();
  const statusStyles = {
    accepted: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {proposal.jobTitle}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                statusStyles[proposal.status]
              }`}
            >
              {proposal.status}
            </span>
            <span className="text-gray-500 text-sm">
              Submitted on{" "}
              {new Date(proposal.dateSubmitted).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          {proposal.status === "pending" && (
            <>
              <button className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
                <PencilIcon className="h-5 w-5 mr-2" />
                Edit Proposal
              </button>
              <button className="flex items-center px-4 py-2 border border-red-600 text-red-600 hover:bg-red-50 rounded-lg">
                <XCircleIcon className="h-5 w-5 mr-2" />
                Withdraw
              </button>
            </>
          )}
          <button className="flex items-center px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg">
            <EnvelopeIcon className="h-5 w-5 mr-2" />
            Message Client
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Proposal Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Proposal Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Your Proposal</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <StatCard
                icon={CurrencyBangladeshiIcon}
                title="Proposed Amount"
                value={`৳${proposal.proposedAmount.toLocaleString()}`}
              />
              <StatCard
                icon={ClockIcon}
                title="Estimated Time"
                value={proposal.estimatedTime}
              />
            </div>
            <div>
              <h3 className="font-medium mb-2">Cover Letter</h3>
              <p className="text-gray-600 whitespace-pre-line">
                {proposal.coverLetter}
              </p>
            </div>
          </div>

          {/* Job Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Job Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Budget Range</label>
                <p className="font-medium">{proposal.jobDetails.budgetRange}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Posted</label>
                <p className="font-medium">{proposal.jobDetails.posted}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">
                  Proposals Received
                </label>
                <p className="font-medium">
                  {proposal.jobDetails.proposalsReceived}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {proposal.jobDetails.skillsRequired.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Client & Timeline */}
        <div className="space-y-6">
          {/* Client Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Client Information</h2>
            <div className="flex items-start gap-4">
              <UserCircleIcon className="h-12 w-12 text-gray-400" />
              <div className="space-y-1">
                <h3 className="font-medium">{proposal.client.name}</h3>
                <p className="text-gray-600">{proposal.client.location}</p>
                <div className="flex items-center">
                  <span className="text-emerald-600">
                    ★ {proposal.client.rating}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="text-gray-600">
                    Member since {proposal.client.memberSince}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Total spent: {proposal.client.totalSpent}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Activity Timeline</h2>
            <div className="space-y-4">
              {proposal.timeline.map((event, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 w-2 h-2 bg-emerald-600 rounded-full" />
                  <div>
                    <p className="text-sm font-medium">{event.event}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="bg-emerald-100 p-2 rounded-lg">
          <Icon className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <dt className="text-sm text-gray-500">{title}</dt>
          <dd className="font-medium">{value}</dd>
        </div>
      </div>
    </div>
  );
}
