// app/routes/_public+/gigs.$id.jsx
import { useLoaderData, Link } from "@remix-run/react";
import {
  BriefcaseIcon,
  CurrencyBangladeshiIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  UserIcon,
  GlobeAltIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";

export async function loader({ request, params }) {
  const { redirect } = await import("@remix-run/node");
  const { getSession } = await import("../../../../utils/session");
  const { createSessionClient } = await import("../../../../utils/appwrite");
  const { DATABASE_ID, GIG_COLLECTION, USER_COLLECTION } = await import(
    "../../../../utils/config"
  );

  const session = await getSession(request.headers.get("Cookie"));

  if (
    !session.get("secret") ||
    !session.get("userId") ||
    !session.get("role")
  ) {
    return redirect("/login");
  }

  try {
    const { databases } = await createSessionClient(session.get("secret"));

    // Get the gig document
    const gig = await databases.getDocument(
      DATABASE_ID,
      GIG_COLLECTION,
      params.id
    );

    // Get the client document
    const client = await databases.getDocument(
      DATABASE_ID,
      USER_COLLECTION,
      gig.clientId
    );
    console.log("client", client);

    return { gig, client };
  } catch (error) {
    console.error(error);
    return redirect("/freelancer/gigs");
  }
}

export default function GigDetails() {
  const { gig, client } = useLoaderData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            to="/freelancer/gigs"
            className="text-emerald-600 hover:text-emerald-700 flex items-center"
          >
            ← Back to Gigs
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Gig Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{gig.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                    <span>{client.companyName}</span>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <BookmarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Gig Meta */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="flex items-start gap-2">
                  <MapPinIcon className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Location
                    </p>
                    <p className="text-gray-900 font-medium">{gig.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CurrencyBangladeshiIcon className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Budget
                    </p>
                    <p className="text-gray-900 font-medium">
                      ৳{gig.budget.toLocaleString()}
                      <span className="text-gray-500 text-sm ml-1">
                        ({gig.budgetType})
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <BriefcaseIcon className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Type
                    </p>
                    <p className="text-gray-900 font-medium capitalize">
                      {gig.budgetType}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <UserIcon className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Experience
                    </p>
                    <p className="text-gray-900 font-medium">
                      {gig.experienceLevel.replace("-", " ")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Gig Description</h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {gig.description}
                </p>
              </div>

              {/* Skills */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {gig.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Posted Info */}
              <div className="text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  Posted: {new Date(gig.$createdAt).toLocaleDateString()}
                </span>
                <span>• {gig.applicantsId.length} applications</span>
              </div>
            </div>
          </div>

          {/* Right Column - Action Cards */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg mb-4">
                <Link to={`/freelancer/gigs/${gig.id}/apply`}>Apply Now</Link>
              </button>
              <button className="w-full py-3 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                Save Gig
              </button>
            </div>

            {/* Company Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">About The Client</h2>
              <div className="flex items-center mb-4">
                <GlobeAltIcon className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-gray-600">{client.website}</span>
              </div>
              <p className="text-gray-600">{client.bio}</p>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Gig Insights</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Applications</span>
                  <span className="font-medium">{gig.applicantsId.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{gig.duration} months</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium capitalize">{gig.status}</span>
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
                Update your CV and portfolio to match the gig requirements
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-emerald-600 font-bold text-lg mb-2">2</div>
              <h3 className="font-medium mb-2">Review Proposal</h3>
              <p className="text-gray-600">
                Craft a tailored proposal highlighting relevant experience
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-emerald-600 font-bold text-lg mb-2">3</div>
              <h3 className="font-medium mb-2">Submit Application</h3>
              <p className="text-gray-600">
                Click 'Apply Now' to submit your application
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
