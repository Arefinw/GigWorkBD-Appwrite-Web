import { Form, Link } from "@remix-run/react";
import {
  UserCircleIcon,
  LockClosedIcon,
  BellIcon,
  CreditCardIcon,
  GlobeAltIcon,
  TrashIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export default function Settings() {
  const navigation = [
    { name: "Account", icon: UserCircleIcon, href: "#account" },
    { name: "Security", icon: LockClosedIcon, href: "#security" },
    { name: "Notifications", icon: BellIcon, href: "#notifications" },
    { name: "Billing", icon: CreditCardIcon, href: "#billing" },
    { name: "Preferences", icon: GlobeAltIcon, href: "#preferences" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="md:w-64 space-y-1">
          <Link
            to="/dashboard"
            className="flex items-center text-emerald-600 hover:text-emerald-700 mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>

          <nav className="bg-white rounded-xl shadow-lg p-4 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-emerald-50 rounded-lg group"
              >
                <item.icon className="h-5 w-5 mr-3 text-gray-500 group-hover:text-emerald-600" />
                {item.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Account Settings */}
          <section id="account" className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold flex items-center mb-8">
              <UserCircleIcon className="h-8 w-8 text-emerald-600 mr-3" />
              Account Settings
            </h2>

            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
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
                  Save Changes
                </button>
              </div>
            </Form>
          </section>

          {/* Security Settings */}
          <section id="security" className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold flex items-center mb-8">
              <LockClosedIcon className="h-8 w-8 text-emerald-600 mr-3" />
              Security
            </h2>

            <div className="space-y-6">
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                  >
                    Update Password
                  </button>
                </div>
              </Form>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Active Sessions</h3>
                <div className="space-y-4">
                  {/* Session items would be mapped here */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Chrome on Windows</p>
                      <p className="text-sm text-gray-500">
                        Last active 2 hours ago
                      </p>
                    </div>
                    <button className="text-red-600 hover:text-red-700 text-sm">
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-red-50 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold flex items-center mb-6 text-red-600">
              <TrashIcon className="h-8 w-8 mr-3" />
              Danger Zone
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-gray-500">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                  Delete Account
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
