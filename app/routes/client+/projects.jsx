// app/routes/client+/projects.jsx
import { useLoaderData } from "@remix-run/react";
import {
  BriefcaseIcon,
  CurrencyBangladeshiIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export async function loader() {
  // Mock data - replace with real API calls
  return {
    stats: {
      totalProjects: 8,
      activeProjects: 3,
      completedProjects: 5,
      totalSpent: 1250000,
    },
    projects: [
      {
        id: 1,
        title: "E-commerce Platform Development",
        status: "active",
        progress: 65,
        budget: 150000,
        spent: 95000,
        startDate: "2024-02-15",
        deadline: "2024-06-15",
        freelancers: ["John Doe", "Jane Smith"],
        milestones: [
          "Design Approved",
          "Backend Development",
          "Frontend Implementation",
        ],
      },
      {
        id: 2,
        title: "Mobile App UI/UX Design",
        status: "completed",
        progress: 100,
        budget: 75000,
        spent: 70000,
        startDate: "2024-01-10",
        deadline: "2024-03-10",
        freelancers: ["Alex Johnson"],
        milestones: ["Wireframes", "Visual Design", "Design System"],
      },
    ],
  };
}

export default function ClientProjects() {
  const { stats, projects } = useLoaderData();

  const statusStyles = {
    active: "bg-emerald-100 text-emerald-800",
    completed: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={BriefcaseIcon}
          title="Total Projects"
          value={stats.totalProjects}
        />
        <StatCard
          icon={ChartBarIcon}
          title="Active Projects"
          value={stats.activeProjects}
        />
        <StatCard
          icon={CheckCircleIcon}
          title="Completed"
          value={stats.completedProjects}
        />
        <StatCard
          icon={CurrencyBangladeshiIcon}
          title="Total Spent"
          value={`৳${stats.totalSpent.toLocaleString()}`}
        />
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold">All Projects</h2>
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
          {projects.map((project) => (
            <div
              key={project.id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                {/* Project Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      <div className="flex items-center mt-2 text-gray-600">
                        <CalendarIcon className="h-5 w-5 mr-2 text-emerald-600" />
                        <span>
                          {new Date(project.startDate).toLocaleDateString()} -{" "}
                          {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        statusStyles[project.status]
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Budget Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Budget</label>
                      <p className="font-medium">
                        ৳{project.budget.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Spent</label>
                      <p className="font-medium">
                        ৳{project.spent.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Milestones</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.milestones.map((milestone, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm"
                        >
                          {milestone}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Freelancers and Actions */}
                <div className="md:w-64 space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Freelancers</h4>
                    <div className="space-y-2">
                      {project.freelancers.map((freelancer, index) => (
                        <div
                          key={index}
                          className="flex items-center p-2 bg-gray-50 rounded"
                        >
                          <UserGroupIcon className="h-5 w-5 text-emerald-600 mr-2" />
                          <span className="text-sm">{freelancer}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded">
                      View Details
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
