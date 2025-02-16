import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { z } from "zod";
import {
  BriefcaseIcon,
  CurrencyBangladeshiIcon,
  CalendarIcon,
  DocumentTextIcon,
  LinkIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export async function loader({ params }) {
  // Fetch job details - replace with real API call
  const job = {
    id: params.id,
    title: "Senior React Developer",
    budget: "৳80,000 - ৳120,000",
    location: "Dhaka, Bangladesh",
    skills: ["React", "TypeScript", "Redux", "Node.js"],
  };

  return json({ job });
}

const ApplicationSchema = z.object({
  coverLetter: z
    .string()
    .min(100, "Cover letter must be at least 100 characters"),
  proposedAmount: z.number().min(1, "Proposed amount is required"),
  availability: z.string().refine((val) => new Date(val) > new Date(), {
    message: "Availability date must be in the future",
  }),
  attachments: z.array(z.string().url()).optional(),
});

export async function action({ request, params }) {
  const formData = await request.formData();

  try {
    const values = ApplicationSchema.parse({
      coverLetter: formData.get("coverLetter"),
      proposedAmount: Number(formData.get("proposedAmount")),
      availability: formData.get("availability"),
      attachments: formData.getAll("attachments"),
    });

    // Submit application logic here
    return redirect(`/jobs/${params.id}/confirmation`);
  } catch (error) {
    return json({ error: error.errors }, { status: 400 });
  }
}

export default function ApplyToJob() {
  const { job } = useLoaderData();
  const navigation = useNavigation();
  const [links, setLinks] = useState([""]);

  const addLink = () => setLinks([...links, ""]);
  const removeLink = (index) => setLinks(links.filter((_, i) => i !== index));
  const updateLink = (index, value) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
        {/* Job Header */}
        <div className="border-b pb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <BriefcaseIcon className="h-8 w-8 text-emerald-600 mr-3" />
            Apply to {job.title}
          </h1>
          <div className="mt-2 text-gray-600">
            {job.location} • {job.budget}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
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

        <Form method="post" className="space-y-8">
          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <DocumentTextIcon className="h-5 w-5 text-emerald-600 mr-2" />
              Cover Letter
            </label>
            <textarea
              name="coverLetter"
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Explain why you're the best candidate for this job..."
            />
          </div>

          {/* Proposed Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <CurrencyBangladeshiIcon className="h-5 w-5 text-emerald-600 mr-2" />
                Proposed Amount
              </label>
              <div className="flex items-center">
                <span className="mr-2">৳</span>
                <input
                  name="proposedAmount"
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <CalendarIcon className="h-5 w-5 text-emerald-600 mr-2" />
                Availability Date
              </label>
              <input
                name="availability"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <LinkIcon className="h-5 w-5 text-emerald-600 mr-2" />
              Portfolio Links
            </label>
            <div className="space-y-2">
              {links.map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    name="attachments"
                    type="url"
                    value={link}
                    onChange={(e) => updateLink(index, e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  {links.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addLink}
                className="text-emerald-600 hover:text-emerald-700 text-sm"
              >
                + Add another link
              </button>
            </div>
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
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:bg-emerald-400"
              disabled={navigation.state === "submitting"}
            >
              {navigation.state === "submitting"
                ? "Submitting..."
                : "Submit Application"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
