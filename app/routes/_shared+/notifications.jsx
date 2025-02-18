// app/routes/_shared+/notifications.jsx
import { useLoaderData } from "@remix-run/react";
import {
  BellIcon,
  CheckCircleIcon,
  CurrencyBangladeshiIcon,
  ChatBubbleBottomCenterTextIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export async function loader() {
  // Mock data - replace with real API calls
  return {
    stats: {
      total: 15,
      unread: 3,
      mentions: 2,
    },
    notifications: [
      {
        id: 1,
        type: "payment",
        title: "Payment Received",
        message: "Your payment of ৳25,000 has been processed",
        timestamp: "2024-05-20T14:30:00",
        read: false,
      },
      {
        id: 2,
        type: "message",
        title: "New Message",
        message: "John Doe sent you a message about your project",
        timestamp: "2024-05-20T12:45:00",
        read: true,
      },
      {
        id: 3,
        type: "alert",
        title: "Project Deadline",
        message: "Reminder: 'E-commerce Platform' due in 3 days",
        timestamp: "2024-05-20T10:15:00",
        read: false,
      },
    ],
  };
}

export default function Notifications() {
  const { stats, notifications } = useLoaderData();

  const typeIcons = {
    payment: CurrencyBangladeshiIcon,
    message: ChatBubbleBottomCenterTextIcon,
    alert: ExclamationTriangleIcon,
    default: BellIcon,
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={BellIcon}
          title="Total Notifications"
          value={stats.total}
        />
        <StatCard
          icon={CheckCircleIcon}
          title="Unread"
          value={stats.unread}
          badgeColor="bg-emerald-100 text-emerald-800"
        />
        <StatCard
          icon={ChatBubbleBottomCenterTextIcon}
          title="Mentions"
          value={stats.mentions}
        />
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-full">
          All
        </button>
        <button className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full hover:bg-emerald-200">
          Unread
        </button>
        <button className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full hover:bg-emerald-200">
          Mentions
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center">
            <BellIcon className="h-6 w-6 text-emerald-600 mr-2" />
            Recent Notifications
          </h2>
          <button className="text-emerald-600 hover:text-emerald-700">
            Mark all as read
          </button>
        </div>

        <div className="divide-y divide-gray-200">
          {notifications.map((notification) => {
            const Icon = typeIcons[notification.type] || typeIcons.default;
            return (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 ${
                  !notification.read ? "bg-emerald-50" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Icon className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{notification.title}</h3>
                      {!notification.read && (
                        <span className="h-2 w-2 bg-emerald-500 rounded-full" />
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      {new Date(notification.timestamp).toLocaleDateString(
                        "en-BD",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, badgeColor }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-emerald-100 p-3 rounded-lg">
            <Icon className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="ml-4">
            <dt className="text-sm font-medium text-gray-500">{title}</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">
              {value}
            </dd>
          </div>
        </div>
        {badgeColor && (
          <span className={`px-2 py-1 rounded-full text-sm ${badgeColor}`}>
            New
          </span>
        )}
      </div>
    </div>
  );
}
