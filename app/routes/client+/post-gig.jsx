// app/routes/client+/post-gig.jsx
import { useState } from "react";
import {
  getFormProps,
  getInputProps,
  getSelectProps,
  useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Form, useActionData } from "@remix-run/react";
import { gigSchema } from "../../utils/schema";
import {
  BriefcaseIcon,
  CurrencyBangladeshiIcon,
  DocumentTextIcon,
  ClockIcon,
  TagIcon,
  CalendarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function PostGig() {
  const lastSubmission = useActionData();

  // Set up form handling with Conform
  const [form, fields] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: gigSchema });
    },
    shouldValidate: "onBlur",
  });
  const [requiredSkills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  const [budgetType, setBudgetType] = useState("one-time");

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill.length < 2 || requiredSkills.includes(trimmedSkill))
      return; // Avoid duplicates and invalid values
    setSkills([...requiredSkills, trimmedSkill]);
    setNewSkill(""); // Reset input after adding
  };

  const handleRemoveSkill = (index) => {
    setSkills(requiredSkills.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
          <BriefcaseIcon className="h-8 w-8 text-emerald-600 mr-3" />
          Post a New Gig
        </h1>

        <Form method="POST" {...getFormProps(form)} className="space-y-8">
          {/* Gig Title */}
          <div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gig Title
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g. Senior React Developer Needed"
                {...getInputProps(fields.title, { type: "text" })}
              />
            </div>
            {fields.title.errors && (
              <p className="text-red-500 text-xs mt-1">{fields.title.errors}</p>
            )}
          </div>
          {/* Gig Description */}
          <div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gig Description
              </label>
              <textarea
                rows={6}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Describe the project details, requirements, and expectations..."
                {...getInputProps(fields.description, { type: "text" })}
              />
            </div>
            {fields.description.errors && (
              <p className="text-red-500 text-xs mt-1">
                {fields.description.errors}
              </p>
            )}
          </div>
          {/* Budget Type */}
          <div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Type
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setBudgetType("one-time")}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    budgetType === "one-time"
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <CurrencyBangladeshiIcon className="h-5 w-5 mr-2" />
                  One-Time Payment
                </button>
                <button
                  type="button"
                  onClick={() => setBudgetType("monthly")}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    budgetType === "monthly"
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <ClockIcon className="h-5 w-5 mr-2" />
                  Monthly Rate
                </button>
              </div>
              <input type="hidden" name="budgetType" value={budgetType} />
              {fields.budgetType.errors && (
                <p className="text-red-500 text-xs mt-1">
                  {fields.budgetType.errors}
                </p>
              )}
            </div>
          </div>
          {/* Budget Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {budgetType === "one-time"
                ? "Budget Range"
                : "Monthly Rate Range"}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center">
                  <span className="mr-2 text-gray-500">৳</span>
                  <input
                    required
                    placeholder="Minimum"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    {...getInputProps(fields.minBudget, { type: "number" })}
                  />
                </div>
                {fields.minBudget.errors && (
                  <p className="text-red-500 text-xs mt-1">
                    {fields.minBudget.errors}
                  </p>
                )}
              </div>
              <div>
                <div className="flex items-center">
                  <span className="mr-2 text-gray-500">৳</span>
                  <input
                    type="number"
                    required
                    placeholder="Maximum"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    {...getInputProps(fields.maxBudget, { type: "number" })}
                  />
                </div>
                {fields.maxBudget.errors && (
                  <p className="text-red-500 text-xs mt-1">
                    {fields.maxBudget.errors}
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* Skill tags (above input) */}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Required Skills
          </label>
          {/* Skill tags */}
          <div className="flex flex-wrap gap-2 mb-2">
            {requiredSkills.map((skill, index) => (
              <span
                key={index}
                className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-base"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="text-emerald-600 hover:text-emerald-800"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
          {/* Input box (on a separate line below skills) */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="newSkill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddSkill())
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Type a skill and press Enter"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
            >
              Add Skill
            </button>
          </div>
          {/* Error message for validation */}
          {fields.requiredSkills.errors && (
            <p className="text-red-500 text-sm mt-1">
              {fields.requiredSkills.errors}
            </p>
          )}
          {/* Hidden input to submit skills as an array */}
          {requiredSkills.map((skill, index) => (
            <input
              key={index}
              type="hidden"
              name={`requiredSkills[${index}]`}
              value={skill}
            />
          ))}{" "}
          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </label>
            <select
              {...getSelectProps(fields.experience)}
              defaultValue={"DEFAULT"}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="DEFAULT" disabled>
                Select an experience level
              </option>
              <option value={"entry-level"}>Entry Level</option>
              <option value={"intermediate"}>Intermediate</option>
              <option value={"advanced"}>Advanced</option>
            </select>
            {fields.experience.errors && (
              <p className="text-red-500 text-xs mt-1">
                {fields.experience.errors}
              </p>
            )}
          </div>
          {/* Gig Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gig Category
            </label>
            <select
              {...getSelectProps(fields.category)}
              defaultValue={"DEFAULT"}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="DEFAULT" disabled>
                Select a category
              </option>
              <option>Web Development</option>
              <option>Mobile Development</option>
              <option>UI/UX Design</option>
              <option>Digital Marketing</option>
              <option>Content Writing</option>
            </select>
            {fields.category.errors && (
              <p className="text-red-500 text-xs mt-1">
                {fields.category.errors}
              </p>
            )}
          </div>
          {/* Project Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gig Category
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg"
              defaultValue={"DEFAULT"}
              {...getInputProps(fields.duration, { type: "select" })}
            >
              <option value="DEFAULT" disabled>
                Select duration
              </option>
              <option value="1-3">1 to 3 months</option>
              <option value="3-6">3 to 6 months</option>
              <option value="6+">More than 6 months</option>
            </select>
            {fields.duration.errors && (
              <p className="text-red-500 text-sm mt-1">
                {fields.duration.errors}
              </p>
            )}
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
              Post gig
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export async function loader({ request }) {
  return true;
}

export async function action({ request }) {
  const { redirect } = await import("@remix-run/node");
  const { parseWithZod } = await import("@conform-to/zod");
  const { getSession } = await import("../../utils/session");
  const { gigSchema } = await import("../../utils/schema");
  const formData = await request.formData();
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.get("secret") || !session.get("userId")) {
    return redirect("/login");
  }
  const submission = parseWithZod(formData, { schema: gigSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  console.log("submission", submission);

  return true;
}
