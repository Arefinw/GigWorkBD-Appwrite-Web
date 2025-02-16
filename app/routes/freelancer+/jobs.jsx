import { useLoaderData } from "@remix-run/react";
import {
  BriefcaseIcon,
  CurrencyBangladeshiIcon,
  ClockIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

export async function loader() {
  // Mock data - replace with real API calls
  return {
    stats: {
      totalJobs: 142,
      averageBudget: 45000,
      newToday: 23,
    },
    jobs: [
      {
        id: 1,
        title: "E-commerce Website Development",
        budget: 80000,
        type: "fixed",
        posted: "2h ago",
        skills: ["React", "Node.js", "MongoDB"],
        proposals: 5,
        clientRating: 4.9,
      },
      {
        id: 2,
        title: "Mobile App UI/UX Design",
        budget: 50000,
        type: "hourly",
        posted: "5h ago",
        skills: ["Figma", "Adobe XD", "Prototyping"],
        proposals: 3,
        clientRating: 4.7,
      },
      // Add more mock jobs as needed
    ],
  };
}

export default function FreelancerJobs() {
  const { stats, jobs } = useLoaderData();

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={BriefcaseIcon}
          title="Total Jobs"
          value={stats.totalJobs}
        />
        <StatCard
          icon={CurrencyBangladeshiIcon}
          title="Avg. Budget"
          value={`৳${stats.averageBudget.toLocaleString()}`}
        />
        <StatCard icon={ClockIcon} title="New Today" value={stats.newToday} />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search jobs by skills or keywords..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FunnelIcon className="h-5 w-5 text-gray-600 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              {/* Job Details */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <CurrencyBangladeshiIcon className="h-5 w-5 mr-1 text-emerald-600" />
                    <span className="font-medium">
                      ৳{job.budget.toLocaleString()}
                    </span>
                    <span className="ml-2 text-sm">
                      ({job.type === "fixed" ? "Fixed Price" : "Hourly"})
                    </span>
                  </div>
                  <div className="flex items-center">
                    <ChartBarIcon className="h-5 w-5 mr-1 text-emerald-600" />
                    <span className="text-sm">{job.proposals} proposals</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  Posted {job.posted} • Client rating: {job.clientRating}/5
                </div>
              </div>

              {/* Action Button */}
              <div className="md:text-right">
                <button className="w-full md:w-auto px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        ))}
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
