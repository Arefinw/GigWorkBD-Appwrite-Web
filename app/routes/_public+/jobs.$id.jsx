import { useLoaderData, Link } from "@remix-run/react";
import {
  BriefcaseIcon,
  CurrencyBangladeshiIcon,
  MapPinIcon,
  ClockIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  UserIcon,
  GlobeAltIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";

export async function loader({ params }) {
  // Mock data - replace with real API call using params.id
  const job = {
    id: params.id,
    title: "Senior React Developer",
    company: "Tech Solutions BD",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    experience: "Mid-Senior",
    salary: "৳80,000 - ৳120,000",
    skills: ["React", "TypeScript", "Redux", "Node.js"],
    description: `
      We're looking for an experienced React developer to join our growing team.
      You'll be responsible for building and maintaining high-performance web applications
      using modern technologies. The ideal candidate has 3+ years of experience with
      React ecosystem and a strong understanding of software development principles.
    `,
    requirements: [
      "3+ years of professional React experience",
      "Proficiency with TypeScript",
      "Experience with state management (Redux/MobX)",
      "Knowledge of RESTful APIs",
      "Familiarity with testing frameworks",
    ],
    posted: "2 hours ago",
    applications: 15,
    views: 234,
  };

  return { job };
}

export default function JobDetails() {
  const { job } = useLoaderData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            to="/jobs"
            className="text-emerald-600 hover:text-emerald-700 flex items-center"
          >
            ← Back to Jobs
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                    <span>{job.company}</span>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <BookmarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Job Meta */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 text-emerald-600 mr-2" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                  <CurrencyBangladeshiIcon className="h-5 w-5 text-emerald-600 mr-2" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center">
                  <BriefcaseIcon className="h-5 w-5 text-emerald-600 mr-2" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-emerald-600 mr-2" />
                  <span>{job.experience}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {job.description}
                </p>
              </div>

              {/* Requirements */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              {/* Skills */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Skills Required</h2>
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

              {/* Posted Info */}
              <div className="text-sm text-gray-500">
                Posted {job.posted} • {job.views} views • {job.applications}{" "}
                applications
              </div>
            </div>
          </div>

          {/* Right Column - Action Cards */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg mb-4">
                Apply Now
              </button>
              <button className="w-full py-3 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                Save Job
              </button>
            </div>

            {/* Company Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                About {job.company}
              </h2>
              <div className="flex items-center mb-4">
                <GlobeAltIcon className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-gray-600">techsolutionsbd.com</span>
              </div>
              <p className="text-gray-600">
                Leading tech company in Bangladesh specializing in enterprise
                software solutions and digital transformation services.
              </p>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Job Insights</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Applications</span>
                  <span className="font-medium">{job.applications}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Views</span>
                  <span className="font-medium">{job.views}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Posting Time</span>
                  <span className="font-medium">{job.posted}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How to Apply */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">How to Apply</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg">
              <div className="text-emerald-600 font-bold text-lg mb-2">1</div>
              <h3 className="font-medium mb-2">Prepare Documents</h3>
              <p className="text-gray-600">
                Update your CV and portfolio to match the job requirements
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-emerald-600 font-bold text-lg mb-2">2</div>
              <h3 className="font-medium mb-2">Review Profile</h3>
              <p className="text-gray-600">
                Ensure your freelancer profile is complete and up-to-date
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-emerald-600 font-bold text-lg mb-2">3</div>
              <h3 className="font-medium mb-2">Submit Proposal</h3>
              <p className="text-gray-600">
                Click 'Apply Now' and submit your tailored proposal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
