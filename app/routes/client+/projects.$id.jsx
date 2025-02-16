import { useLoaderData, Link } from "@remix-run/react";
import {
  BriefcaseIcon,
  CurrencyBangladeshiIcon,
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export async function loader({ params }) {
  // Mock data - replace with real API call using params.id
  return {
    project: {
      id: params.id,
      title: "E-commerce Platform Development",
      status: "active",
      progress: 65,
      budget: 150000,
      spent: 95000,
      startDate: "2024-02-15",
      deadline: "2024-06-15",
      description: `Develop a full-stack e-commerce platform with React frontend and Node.js backend. 
      Includes user authentication, product management, and payment gateway integration.`,
      freelancers: [
        { name: "John Doe", role: "Frontend Developer" },
        { name: "Jane Smith", role: "Backend Developer" },
      ],
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
      recentActivity: [
        {
          date: "2024-05-20",
          text: "Frontend prototype submitted by John Doe",
        },
        { date: "2024-05-18", text: "API documentation reviewed and approved" },
      ],
    },
  };
}

export default function ProjectDetails() {
  const { project } = useLoaderData();
  const statusStyles = {
    active: "bg-emerald-100 text-emerald-800",
    completed: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <Link
        to="/client/projects"
        className="flex items-center text-emerald-600 hover:text-emerald-700"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Projects
      </Link>

      {/* Project Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <BriefcaseIcon className="h-8 w-8 text-emerald-600 mr-3" />
              {project.title}
            </h1>
            <div className="flex items-center mt-4 gap-4">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  statusStyles[project.status]
                }`}
              >
                {project.status}
              </span>
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="h-5 w-5 mr-2" />
                {new Date(project.startDate).toLocaleDateString()} -{" "}
                {new Date(project.deadline).toLocaleDateString()}
              </div>
            </div>
          </div>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
            Edit Project
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Project Progress</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">
                  {project.progress}% Complete
                </span>
                <div className="flex items-center text-emerald-600">
                  <CurrencyBangladeshiIcon className="h-5 w-5 mr-1" />
                  <span>
                    ৳{project.spent.toLocaleString()} / ৳
                    {project.budget.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-emerald-600 h-3 rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Milestones</h2>
            <div className="space-y-4">
              {project.milestones.map((milestone, index) => (
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

          {/* Description */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Project Description</h2>
            <p className="text-gray-600 whitespace-pre-line">
              {project.description}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Freelancers */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Team Members</h2>
            <div className="space-y-4">
              {project.freelancers.map((freelancer, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 hover:bg-gray-50 rounded-lg"
                >
                  <UserGroupIcon className="h-8 w-8 text-emerald-600 mr-4" />
                  <div>
                    <h3 className="font-medium">{freelancer.name}</h3>
                    <p className="text-sm text-gray-500">{freelancer.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {project.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start border-l-4 border-emerald-500 pl-4"
                >
                  <div className="flex-1">
                    <p className="text-gray-600">{activity.text}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(activity.date).toLocaleDateString()}
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
