import { useLoaderData, Link } from "@remix-run/react";
import {
  StarIcon,
  UserCircleIcon,
  CalendarIcon,
  BriefcaseIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export async function loader({ params }) {
  // Mock data - replace with real API call using params.clientId
  return {
    client: {
      id: params.clientId,
      name: "Tech Solutions BD",
      rating: 4.7,
      totalReviews: 15,
      memberSince: "2022",
      totalSpent: "৳2,500,000",
    },
    reviews: [
      {
        id: 1,
        rating: 5,
        comment:
          "Exceptional work! Delivered beyond expectations and was very professional.",
        project: "E-commerce Platform Development",
        date: "2024-03-15",
      },
      {
        id: 2,
        rating: 4,
        comment: "Good communication and met all deadlines. Would work again.",
        project: "Mobile App UI Design",
        date: "2024-02-28",
      },
    ],
    ratingDistribution: {
      5: 10,
      4: 3,
      3: 1,
      2: 1,
      1: 0,
    },
  };
}

export default function ClientReviews() {
  const { client, reviews, ratingDistribution } = useLoaderData();

  // Calculate width percentages for rating distribution bars
  const totalRatings = Object.values(ratingDistribution).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="space-y-8">
      {/* Header with Back Navigation */}
      <Link
        to="/freelancer/reviews"
        className="flex items-center text-emerald-600 hover:text-emerald-700"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to All Reviews
      </Link>

      {/* Client Profile Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-6">
          <UserCircleIcon className="h-16 w-16 text-gray-400" />
          <div>
            <h1 className="text-2xl font-bold">{client.name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(client.rating)
                        ? "text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                {client.rating} ({client.totalReviews} reviews)
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Member since {client.memberSince} • Total spent{" "}
              {client.totalSpent}
            </div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Rating Breakdown</h2>
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

        {/* Client Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Client Statistics</h2>
          <div className="space-y-4">
            <StatItem
              icon={StarIcon}
              title="Average Rating Given"
              value={client.rating}
              color="text-amber-400"
            />
            <StatItem
              icon={BriefcaseIcon}
              title="Total Projects"
              value={client.totalReviews}
              color="text-emerald-600"
            />
            <StatItem
              icon={CalendarIcon}
              title="Member Since"
              value={client.memberSince}
              color="text-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">All Reviews</h2>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b pb-6 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{review.project}</h3>
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
  );
}

function StatItem({ icon: Icon, title, value, color }) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
      <div className="flex items-center">
        <div className={`${color} p-2 rounded-lg bg-opacity-10`}>
          <Icon className="h-6 w-6" />
        </div>
        <span className="ml-4">{title}</span>
      </div>
      <span className="font-medium">{value}</span>
    </div>
  );
}
