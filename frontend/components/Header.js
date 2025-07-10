import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, UserIcon } from "@heroicons/react/24/outline";
import { isAuthenticated, logout } from "../utils/auth";
import { motion } from "framer-motion";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status when component mounts
    setAuthenticated(isAuthenticated());

    // Listen for storage events (for when user logs in/out in another tab)
    const handleStorageChange = () => {
      setAuthenticated(isAuthenticated());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    router.push("/");
  };

  return (
    <Disclosure as="nav" className="bg-white shadow-md sticky top-0 z-50">
      {({ open }) => (
        <>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          >
            <div className="flex h-16 justify-between">
              <div className="flex">
                <motion.div
                  className="flex flex-shrink-0 items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link
                    href="/"
                    className="hover:opacity-90 transition-opacity duration-200"
                  >
                    {/* <h2 className="h-8 w-auto text-primary-500">
                      Com Financial Services
                    </h2> */}
                    <img
                      src="/logo1.png"
                      alt="Com Financial Services"
                      className="h-16 w-auto"
                    />
                  </Link>
                </motion.div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item, index) => {
                    const isActive =
                      router.pathname === item.href ||
                      (item.href !== "/" &&
                        router.pathname.startsWith(item.href));

                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <Link
                          href={item.href}
                          className={`nav-link inline-flex items-center px-1 pt-5 text-m font-bold ${
                            isActive
                              ? "nav-link-active border-b-2 border-primary-500 text-gray-900"
                              : "border-b-2 border-transparent text-gray-500 hover:border-primary-300 hover:text-primary-700"
                          }`}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Auth buttons */}
              <motion.div
                className="hidden sm:ml-6 sm:flex sm:items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {authenticated ? (
                  <div className="flex items-center space-x-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/user/dashboard"
                        className="text-primary-600 hover:text-primary-700 transition-colors duration-200 flex items-center"
                      >
                        <UserIcon className="h-5 w-5 mr-1" />
                        <span>Dashboard</span>
                      </Link>
                    </motion.div>
                    <motion.button
                      onClick={handleLogout}
                      className="btn btn-primary shadow-sm hover:shadow-md transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Sign Out
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/login"
                        className="btn btn-outline shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        Sign In
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/register"
                        className="btn btn-primary shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        Register
                      </Link>
                    </motion.div>
                  </div>
                )}
              </motion.div>

              {/* Mobile menu button */}
              <div className="-mr-2 flex items-center sm:hidden">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-primary-500 hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors duration-200">
                    <span className="sr-only">Open main menu</span>
                    <motion.div
                      animate={{ rotate: open ? 90 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </motion.div>
                  </Disclosure.Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Mobile menu */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: open ? 1 : 0, height: open ? "auto" : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pb-3 pt-2">
                {navigation.map((item, index) => {
                  const isActive =
                    router.pathname === item.href ||
                    (item.href !== "/" &&
                      router.pathname.startsWith(item.href));

                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <Link
                        href={item.href}
                        className={`block py-2 pl-3 pr-4 text-base font-medium ${
                          isActive
                            ? "bg-primary-50 border-l-4 border-primary-500 text-primary-700"
                            : "border-l-4 border-transparent text-gray-500 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-colors duration-200"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile auth buttons */}
              <div className="border-t border-gray-200 pb-3 pt-4">
                {authenticated ? (
                  <div className="space-y-1">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      <Link
                        href="/user/dashboard"
                        className="block px-4 py-2 text-base font-medium text-primary-600 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-200"
                      >
                        <span className="flex items-center">
                          <UserIcon className="h-5 w-5 mr-2" />
                          Dashboard
                        </span>
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                    >
                      <Disclosure.Button
                        as="button"
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-base font-medium text-primary-600 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-200"
                      >
                        Sign Out
                      </Disclosure.Button>
                    </motion.div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-base font-medium text-primary-600 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-200"
                      >
                        Sign In
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                    >
                      <Link
                        href="/register"
                        className="block px-4 py-2 text-base font-medium text-primary-600 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-200"
                      >
                        Register
                      </Link>
                    </motion.div>
                  </div>
                )}
              </div>
            </Disclosure.Panel>
          </motion.div>
        </>
      )}
    </Disclosure>
  );
}
