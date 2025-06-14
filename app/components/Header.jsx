// app/components/Header.jsx
import { Link } from "@remix-run/react";
import { Menu, Transition } from "@headlessui/react";
import {
  BriefcaseIcon,
  UserCircleIcon,
  HomeIcon,
  PlusCircleIcon,
  CurrencyBangladeshiIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  ChatBubbleOvalLeftIcon,
} from "@heroicons/react/24/outline";

export default function Header({
  userId,
  role,
  notificationCount = 3,
  messageCount = 2,
}) {
  const navigation = {
    common: [
      { name: "Home", href: "/", icon: HomeIcon },
      { name: "Browse GIGs", href: "/freelancer/gigs", icon: BriefcaseIcon },
    ],
    client: [
      { name: "Dashboard", href: "/client/dashboard", icon: ChartBarIcon },
      { name: "My GIGs", href: "/client/gigs", icon: DocumentTextIcon },
      { name: "Post GIG", href: "/client/post-gig", icon: PlusCircleIcon },
    ],
    freelancer: [
      {
        name: "My Applications",
        href: "/freelancer/applications",
        icon: CurrencyBangladeshiIcon,
      },
      { name: "Find Work", href: "/freelancer/gigs", icon: BriefcaseIcon },
      {
        name: "Dashboard",
        href: "/freelancer/dashboard",
        icon: ChartBarIcon,
      },
    ],
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Section - Logo & Main Nav */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center text-emerald-600 font-bold text-xl"
            >
              <CurrencyBangladeshiIcon className="h-8 w-8 mr-2" />
              GigWorkBD
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              {!userId &&
                navigation.common.map((item) => (
                  <NavLink key={item.name} item={item} />
                ))}

              {userId &&
                role === "client" &&
                navigation.client.map((item) => (
                  <NavLink key={item.name} item={item} />
                ))}

              {userId &&
                role === "freelancer" &&
                navigation.freelancer.map((item) => (
                  <NavLink key={item.name} item={item} />
                ))}
            </div>
          </div>

          {/* Right Section - User Controls */}
          <div className="flex items-center gap-4">
            {userId && (
              <>
                {/* Notifications Dropdown */}
                <Menu as="div" className="relative">
                  <Menu.Button className="p-2 rounded-full hover:bg-gray-100 relative">
                    <BellIcon className="h-6 w-6 text-gray-600" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {notificationCount}
                      </span>
                    )}
                  </Menu.Button>

                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-2">
                        <div className="px-4 py-2 text-sm font-medium text-gray-900">
                          Notifications
                        </div>
                        <div className="border-t border-gray-100">
                          {/* Notification Items */}
                          <Menu.Item>
                            {() => (
                              <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                New message from Client XYZ
                              </div>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {() => (
                              <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                Your proposal was accepted
                              </div>
                            )}
                          </Menu.Item>
                        </div>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>

                {/* Messages Dropdown */}
                <Menu as="div" className="relative">
                  <Menu.Button className="p-2 rounded-full hover:bg-gray-100 relative">
                    <ChatBubbleOvalLeftIcon className="h-6 w-6 text-gray-600" />
                    {messageCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {messageCount}
                      </span>
                    )}
                  </Menu.Button>

                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-2">
                        <div className="px-4 py-2 text-sm font-medium text-gray-900">
                          Messages
                        </div>
                        <div className="border-t border-gray-100">
                          {/* Message Items */}
                          <Menu.Item>
                            {() => (
                              <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                Client ABC: Let's discuss the project
                              </div>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {() => (
                              <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                System: New gig matches your skills
                              </div>
                            )}
                          </Menu.Item>
                        </div>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            )}

            {userId ? (
              <Menu as="div" className="relative ml-3">
                <div className="flex items-center space-x-2">
                  <Menu.Button className="flex items-center space-x-1 rounded-full p-1 hover:bg-gray-100 transition-colors">
                    <UserCircleIcon className="h-8 w-8 text-gray-600" />
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {userId.firstName}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{role}</p>
                    </div>
                    <ChevronDownIcon className="h-5 w-5 text-gray-500 ml-1" />
                  </Menu.Button>
                </div>

                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/settings"
                            className={`${
                              active ? "bg-gray-100" : ""
                            } flex items-center px-4 py-2 text-sm text-gray-700`}
                          >
                            <Cog6ToothIcon className="h-5 w-5 mr-2" />
                            Settings
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/logout"
                            className={`${
                              active ? "bg-gray-100" : ""
                            } flex items-center px-4 py-2 text-sm text-gray-700`}
                          >
                            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                            Sign Out
                          </Link>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3 space-y-1">
          {navigation.common.map((item) => (
            <MobileNavLink key={item.name} item={item} />
          ))}

          {userId &&
            role === "client" &&
            navigation.client.map((item) => (
              <MobileNavLink key={item.name} item={item} />
            ))}

          {userId &&
            role === "freelancer" &&
            navigation.freelancer.map((item) => (
              <MobileNavLink key={item.name} item={item} />
            ))}
        </div>
      </nav>
    </header>
  );
}

// Rest of the code remains the same for NavLink and MobileNavLink components

function NavLink({ item }) {
  return (
    <Link
      to={item.href}
      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-emerald-600 border-b-2 border-transparent hover:border-emerald-600 transition-colors"
    >
      <item.icon className="h-5 w-5 mr-2" />
      {item.name}
    </Link>
  );
}

function MobileNavLink({ item }) {
  return (
    <Link
      to={item.href}
      className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-md"
    >
      <item.icon className="h-5 w-5 mr-3" />
      {item.name}
    </Link>
  );
}
