// app/routes/_public+/user.$id.jsx
import { useLoaderData, Link } from "@remix-run/react";
import {
  UserCircleIcon,
  BriefcaseIcon,
  CurrencyBangladeshiIcon,
  MapPinIcon,
  CalendarIcon,
  ShieldCheckIcon,
  StarIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

export async function loader({ params }) {
  // Mock data - replace with real API call using params.id
  return {
    profile: {
      id: params.id,
      name: "Abdul Rahman",
      title: "Senior Full Stack Developer",
      location: "Dhaka, Bangladesh",
      bio: "Passionate developer with 5+ years of experience building scalable web applications. Specialized in MERN stack and cloud technologies.",
      skills: ["React", "Node.js", "MongoDB", "AWS", "TypeScript", "GraphQL"],
      experience: [
        {
          company: "Tech Solutions BD",
          role: "Lead Developer",
          duration: "2020 - Present",
        },
        {
          company: "Digital Innovators",
          role: "Full Stack Developer",
          duration: "2018 - 2020",
        },
      ],
      education: [
        {
          institution: "Dhaka University",
          degree: "BSc in Computer Science",
          duration: "2014 - 2018",
        },
      ],
      portfolio: [
        {
          title: "E-commerce Platform",
          description: "Built with React & Node.js",
          url: "#",
        },
        {
          title: "AI Chat Application",
          description: "Next.js & TensorFlow integration",
          url: "#",
        },
      ],
      stats: {
        completedJobs: 42,
        successRate: 98,
        earnings: 2500000,
        memberSince: "2018",
      },
      reviews: [
        {
          client: "Tech Corp BD",
          rating: 5,
          comment: "Exceptional work quality and communication",
        },
        {
          client: "Startup Innovations",
          rating: 4.8,
          comment: "Reliable and professional developer",
        },
      ],
    },
  };
}

export default function PublicProfile() {
  const { profile } = useLoaderData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <UserCircleIcon className="h-24 w-24 text-gray-400" />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
              <p className="text-xl text-emerald-600 mb-2">{profile.title}</p>
              <div className="flex items-center text-gray-600">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span>{profile.location}</span>
              </div>
            </div>
            {/* <div className="md:w-64 space-y-2">
              <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
                Hire Me
              </button>
              <button className="w-full py-2 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                Contact
              </button>
            </div> */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <BriefcaseIcon className="h-6 w-6 mr-2 text-emerald-600" />
                Experience
              </h2>
              <div className="space-y-4">
                {profile.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-emerald-600 pl-4"
                  >
                    <h3 className="font-semibold">{exp.role}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                    <div className="flex items-center text-gray-500 text-sm">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {exp.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <LinkIcon className="h-6 w-6 mr-2 text-emerald-600" />
                Portfolio
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.portfolio.map((project, index) => (
                  <a
                    key={index}
                    href={project.url}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {project.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Performance Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed Jobs</span>
                  <span className="font-medium">
                    {profile.stats.completedJobs}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-medium text-emerald-600">
                    {profile.stats.successRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Earnings</span>
                  <span className="font-medium">
                    ৳{profile.stats.earnings.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">
                    {profile.stats.memberSince}
                  </span>
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <AcademicCapIcon className="h-6 w-6 mr-2 text-emerald-600" />
                Education
              </h2>
              {profile.education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-medium">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  <div className="flex items-center text-gray-500 text-sm">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {edu.duration}
                  </div>
                </div>
              ))}
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <StarIcon className="h-6 w-6 mr-2 text-emerald-600" />
                Client Reviews ({profile.reviews.length})
              </h2>
              <div className="space-y-4">
                {profile.reviews.map((review, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(review.rating)
                                ? "fill-amber-400"
                                : ""
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {review.rating}/5
                      </span>
                    </div>
                    <p className="text-gray-600">"{review.comment}"</p>
                    <p className="text-sm text-gray-500 mt-2">
                      - {review.client}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
