import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { logout } from "../utils/auth";
import RunningBanner from "./RunningBanner";
import {
  HomeIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },
  { name: "Tax Forms", href: "/admin/tax-forms", icon: DocumentTextIcon },
  {
    name: "Contact Messages",
    href: "/admin/contact-messages",
    icon: ChatBubbleLeftRightIcon,
  },
  { name: "Profile", href: "/admin/profile", icon: UserIcon },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Get user info from localStorage if available
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        setUserName(parsed.name || "Admin");
      } catch (error) {
        console.error("Error parsing user info:", error);
        setUserName("Admin");
      }
    } else {
      setUserName("Admin");
    }
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 flex z-40">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            ></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-primary-700">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <h1 className="text-white text-2xl font-bold tracking-tight">Com Financial Admin</h1>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        router.pathname === item.href
                          ? "bg-primary-800 text-white"
                          : "text-primary-100 hover:bg-primary-600 hover:text-white"
                      }`}
                      legacyBehavior
                    >
                      <a className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        router.pathname === item.href
                          ? "bg-primary-800 text-white"
                          : "text-primary-100 hover:bg-primary-600 hover:text-white"
                      }`}>
                        <item.icon
                          className={`mr-4 h-6 w-6 ${
                            router.pathname === item.href
                              ? "text-primary-300"
                              : "text-primary-300"
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-primary-100 hover:bg-primary-600 hover:text-white w-full text-left"
                  >
                    <ArrowLeftOnRectangleIcon
                      className="mr-4 h-6 w-6 text-primary-300"
                      aria-hidden="true"
                    />
                    Logout
                  </button>
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-primary-800 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-800 flex items-center justify-center">
                      <UserIcon
                        className="h-6 w-6 text-primary-200"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-white">
                      {userName}
                    </p>
                    <p className="text-sm font-medium text-primary-200">
                      Administrator
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-primary-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-white text-2xl font-bold tracking-tight">Com Financial Admin</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    router.pathname === item.href
                      ? "bg-primary-800 text-white"
                      : "text-primary-100 hover:bg-primary-600 hover:text-white"
                  }`}
                  legacyBehavior
                >
                  <a className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    router.pathname === item.href
                      ? "bg-primary-800 text-white"
                      : "text-primary-100 hover:bg-primary-600 hover:text-white"
                  }`}>
                    <item.icon
                      className={`mr-3 h-6 w-6 ${
                        router.pathname === item.href
                          ? "text-primary-300"
                          : "text-primary-300"
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                </Link>
              ))}
              <button
                  onClick={handleLogout}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-primary-100 hover:bg-primary-600 hover:text-white w-full text-left"
                >
                <ArrowLeftOnRectangleIcon
                  className="mr-3 h-6 w-6 text-primary-300"
                  aria-hidden="true"
                />
                Logout
              </button>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-primary-800 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-9 w-9 rounded-full bg-primary-800 flex items-center justify-center">
                  <UserIcon
                    className="h-5 w-5 text-primary-200"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{userName}</p>
                <p className="text-xs font-medium text-primary-200">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1 pb-10">{children}</main>
        {/* Import at the top of the file */}
        {typeof window !== "undefined" && <RunningBanner />}
      </div>
    </div>
  );
}
