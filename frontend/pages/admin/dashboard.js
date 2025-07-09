import { useState, useEffect } from "react";
import { withAuth } from "../../utils/auth";
import AdminLayout from "../../components/AdminLayout";
import Link from "next/link";
import {
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { SectionLoading } from "../../components/LoadingState";
import { handleApiErrorWithToast } from "../../utils/errorHandler";
import { transformDashboardStats } from "../../utils/transformers";
import httpClient, { API_PATHS } from "../../utils/httpClient";

function Dashboard() {
  const [stats, setStats] = useState({
    taxFormsPending: 0,
    taxFormsReviewed: 0,
    taxFormsFiled: 0,
    contactMessages: 0,
    recentForms: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await httpClient.get(API_PATHS.ADMIN.STATS);

        // Transform the data using our utility function
        setStats(transformDashboardStats(response.data));
        setLoading(false);
      } catch (error) {
        handleApiErrorWithToast(
          error,
          "Failed to load dashboard data. Please try again.",
          setError
        );
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor = "";
    let textColor = "";
    let icon = null;

    switch (status) {
      case "Pending":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        icon = <ClockIcon className="h-4 w-4 mr-1" />;
        break;
      case "Reviewed":
        bgColor = "bg-blue-100";
        textColor = "text-blue-800";
        icon = <ExclamationCircleIcon className="h-4 w-4 mr-1" />;
        break;
      case "Filed":
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        icon = <CheckCircleIcon className="h-4 w-4 mr-1" />;
        break;
      default:
        bgColor = "bg-gray-100";
        textColor = "text-gray-800";
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
      >
        {icon}
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <SectionLoading message="Loading dashboard data..." />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon
                    className="h-5 w-5 text-red-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Stats cards */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Pending Tax Forms */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon
                      className="h-6 w-6 text-yellow-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pending Tax Forms
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {stats.taxFormsPending}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href="/admin/tax-forms?status=Pending"
                    className="font-medium text-primary-600 hover:text-primary-900"
                    legacyBehavior
                  >
                    <a className="font-medium text-primary-600 hover:text-primary-900">View all</a>
                  </Link>
                </div>
              </div>
            </div>

            {/* Reviewed Tax Forms */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ExclamationCircleIcon
                      className="h-6 w-6 text-blue-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Reviewed Tax Forms
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {stats.taxFormsReviewed}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href="/admin/tax-forms?status=Reviewed"
                    className="font-medium text-primary-600 hover:text-primary-900"
                    legacyBehavior
                  >
                    <a className="font-medium text-primary-600 hover:text-primary-900">View all</a>
                  </Link>
                </div>
              </div>
            </div>

            {/* Filed Tax Forms */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Filed Tax Forms
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {stats.taxFormsFiled}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href="/admin/tax-forms?status=Filed"
                    className="font-medium text-primary-600 hover:text-primary-900"
                    legacyBehavior
                  >
                    <a className="font-medium text-primary-600 hover:text-primary-900">View all</a>
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Messages */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChatBubbleLeftRightIcon
                      className="h-6 w-6 text-primary-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Contact Messages
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {stats.contactMessages}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href="/admin/contact-messages"
                    className="font-medium text-primary-600 hover:text-primary-900"
                    legacyBehavior
                  >
                    <a className="font-medium text-primary-600 hover:text-primary-900">View all</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent submissions */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Tax Form Submissions
            </h2>
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {stats.recentForms && stats.recentForms.length > 0 ? (
                  stats.recentForms.map((form) => (
                    <li key={form._id}>
                      <Link
                        href={`/admin/tax-forms/${form._id}`}
                        className="block hover:bg-gray-50"
                        legacyBehavior
                      >
                        <a className="block hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-primary-600 truncate">
                                {form.fullName}
                              </p>
                              <StatusBadge status={form.status} />
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {form.documents?.length || 0} document(s)
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <DocumentTextIcon
                                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                                {form.pan}
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                <ChatBubbleLeftRightIcon
                                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                                {form.email}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <ClockIcon
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                              <p>
                                Submitted on{" "}
                                <time dateTime={form.createdAt}>
                                  {formatDate(form.createdAt)}
                                </time>
                              </p>
                            </div>
                          </div>
                        </div>
                        </a>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
                    No recent submissions found.
                  </li>
                )}
              </ul>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <Link
                  href="/admin/tax-forms"
                  className="font-medium text-primary-600 hover:text-primary-900"
                  legacyBehavior
                >
                  <a className="font-medium text-primary-600 hover:text-primary-900">View all tax forms</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAuth(Dashboard, "admin");
