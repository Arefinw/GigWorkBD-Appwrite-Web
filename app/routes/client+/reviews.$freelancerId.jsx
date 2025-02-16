import { useLoaderData, Link } from "@remix-run/react";
import {
  StarIcon,
  UserCircleIcon,
  BriefcaseIcon,
  CurrencyBangladeshiIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowLeftIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

export async function loader({ params }) {
  // Mock data - replace with real API call using params.freelancerId
  return {
    freelancer: {
      id: params.freelancerId,
      name: "John Doe",
      rating: 4.8,
      totalReviews: 23,
      completedProjects: 45,
      responseRate: 98,
      totalEarned: 1250000,
    },
    reviews: [
      {
        id: 1,
        rating: 5,
        comment:
          "Exceptional work quality and communication. Delivered ahead of schedule!",
        project: "E-commerce Platform Development",
        date: "2024-03-15",
        client: "Tech Solutions BD",
      },
      {
        id: 2,
        rating: 4,
        comment:
          "Good work but missed some minor deadlines. Overall satisfied.",
        project: "Mobile App UI Design",
        date: "2024-02-28",
        client: "Design Innovators",
      },
    ],
    ratingDistribution: {
      5: 15,
      4: 5,
      3: 2,
      2: 1,
      1: 0,
    },
  };
}

export default function FreelancerReviews() {
  const { freelancer, reviews, ratingDistribution } = useLoaderData();
  const totalRatings = Object.values(ratingDistribution).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <Link
        to="/client/freelancers"
        className="flex items-center text-emerald-600 hover:text-emerald-700"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Freelancers
      </Link>

      {/* Freelancer Profile Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-start gap-6">
          <UserCircleIcon className="h-16 w-16 text-gray-400" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{freelancer.name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(freelancer.rating)
                        ? "text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                {freelancer.rating} ({freelancer.totalReviews} reviews)
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <StatItem
                icon={BriefcaseIcon}
                title="Completed Projects"
                value={freelancer.completedProjects}
              />
              <StatItem
                icon={CurrencyBangladeshiIcon}
                title="Total Earned"
                value={`৳${freelancer.totalEarned.toLocaleString()}`}
              />
              <StatItem
                icon={StarIcon}
                title="Avg. Rating"
                value={freelancer.rating}
              />
              <StatItem
                icon={ChatBubbleBottomCenterTextIcon}
                title="Response Rate"
                value={`${freelancer.responseRate}%`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Rating Distribution</h2>
          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <div className="w-16 flex items-center">
                  {rating} <StarIcon className="h-4 w-4 text-amber-400 ml-1" />
                </div>
                <div className="flex-1 ml-4">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{
                        width: `${
                          (ratingDistribution[rating] / totalRatings) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right text-sm text-gray-600">
                  {ratingDistribution[rating]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b pb-6 last:border-b-0 last:pb-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{review.client}</h3>
                    <p className="text-gray-600 text-sm">{review.project}</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {new Date(review.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating ? "text-amber-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ icon: Icon, title, value }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="bg-emerald-100 p-2 rounded-lg">
          <Icon className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <dt className="text-sm text-gray-500">{title}</dt>
          <dd className="font-medium">{value}</dd>
        </div>
      </div>
    </div>
  );
}
