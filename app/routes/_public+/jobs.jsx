// app/routes/_public+/jobs.jsx
import { Link, useLoaderData } from "@remix-run/react";
import {
  BriefcaseIcon,
  CurrencyBangladeshiIcon,
  MapPinIcon,
  ClockIcon,
  ChartBarIcon,
  SparklesIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

export async function loader() {
  // Mock data - replace with real API calls
  return {
    stats: {
      totalJobs: 142,
      avgSalary: 85000,
      newToday: 23,
    },
    jobs: [
      {
        id: 1,
        title: "Senior React Developer",
        company: "Tech Solutions BD",
        location: "Dhaka, Bangladesh",
        type: "Full-time",
        experience: "Mid-Senior",
        salary: "৳80,000 - ৳120,000",
        skills: ["React", "TypeScript", "Redux", "Node.js"],
        posted: "2h ago",
      },
      {
        id: 2,
        title: "UI/UX Designer",
        company: "Design Innovators",
        location: "Remote",
        type: "Contract",
        experience: "Intermediate",
        salary: "৳50,000 - ৳80,000",
        skills: ["Figma", "Adobe XD", "Prototyping"],
        posted: "5h ago",
      },
    ],
  };
}

export default function JobListings() {
  const { stats, jobs } = useLoaderData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-emerald-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Find Your Next Opportunity
          </h1>
          <p className="text-xl text-emerald-100 mb-8">
            Connect with Bangladesh's top tech companies
          </p>

          {/* Search and Filters */}
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search jobs by title or keyword..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
              <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                Search
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <button className="px-4 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                All Categories
              </button>
              <button className="px-4 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">
                Full-time
              </button>
              <button className="px-4 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">
                Remote
              </button>
              <button className="px-4 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">
                Contract
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 py-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={BriefcaseIcon}
            title="Total Jobs"
            value={stats.totalJobs}
          />
          <StatCard
            icon={CurrencyBangladeshiIcon}
            title="Avg. Salary"
            value={`৳${stats.avgSalary.toLocaleString()}`}
          />
          <StatCard
            icon={SparklesIcon}
            title="New Today"
            value={stats.newToday}
          />
        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <ChartBarIcon className="h-6 w-6 text-emerald-600 mr-2" />
          Recent Job Postings
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                {/* Job Details */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 text-emerald-600 mr-2" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center">
                      <CurrencyBangladeshiIcon className="h-5 w-5 text-emerald-600 mr-2" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 text-emerald-600 mr-2" />
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Section */}
                <div className="md:w-64 flex flex-col justify-between">
                  <div className="text-sm text-gray-500 mb-2">
                    Posted {job.posted}
                  </div>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-center rounded-lg"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
            Load More Jobs
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
          <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
        </div>
      </div>
    </div>
  );
}
