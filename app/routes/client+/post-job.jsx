import { useState } from "react";
import {
  BriefcaseIcon,
  CurrencyBangladeshiIcon,
  DocumentTextIcon,
  ClockIcon,
  TagIcon,
  CalendarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function PostJob() {
  const [skills, setSkills] = useState([]);
  const [inputSkill, setInputSkill] = useState("");
  const [budgetType, setBudgetType] = useState("fixed");

  const addSkill = (e) => {
    e.preventDefault();
    if (inputSkill.trim() && !skills.includes(inputSkill.trim())) {
      setSkills([...skills, inputSkill.trim()]);
      setInputSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
          <BriefcaseIcon className="h-8 w-8 text-emerald-600 mr-3" />
          Post a New Job
        </h1>

        <form className="space-y-8">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g. Senior React Developer Needed"
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              rows={6}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Describe the project details, requirements, and expectations..."
            />
          </div>

          {/* Budget Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setBudgetType("fixed")}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  budgetType === "fixed"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <CurrencyBangladeshiIcon className="h-5 w-5 mr-2" />
                Fixed Price
              </button>
              <button
                type="button"
                onClick={() => setBudgetType("hourly")}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  budgetType === "hourly"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <ClockIcon className="h-5 w-5 mr-2" />
                Hourly Rate
              </button>
            </div>
          </div>

          {/* Budget Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {budgetType === "fixed" ? "Budget Range" : "Hourly Rate Range"}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <span className="mr-2 text-gray-500">৳</span>
                <input
                  type="number"
                  required
                  placeholder="Minimum"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-gray-500">৳</span>
                <input
                  type="number"
                  required
                  placeholder="Maximum"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Skills Required */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Required Skills
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full flex items-center"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 hover:text-emerald-800"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputSkill}
                onChange={(e) => setInputSkill(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addSkill(e)}
                placeholder="Add skills (press Enter to add)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
              >
                Add Skill
              </button>
            </div>
          </div>

          {/* Job Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Category
            </label>
            <select
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select a category</option>
              <option>Web Development</option>
              <option>Mobile Development</option>
              <option>UI/UX Design</option>
              <option>Digital Marketing</option>
              <option>Content Writing</option>
            </select>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Deadline
            </label>
            <input
              type="date"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-8">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
