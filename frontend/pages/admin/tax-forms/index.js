import { useState, useEffect } from "react";
import { withAuth } from "../../../utils/auth";
import AdminLayout from "../../../components/AdminLayout";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { SectionLoading } from "../../../components/LoadingState";
import { handleApiErrorWithToast } from "../../../utils/errorHandler";
import { transformPagination } from "../../../utils/transformers";
import httpClient, { API_PATHS } from "../../../utils/httpClient";

function TaxForms() {
  const router = useRouter();
  const { status: initialStatus, search: initialSearch } = router.query;

  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState(initialStatus || "");
  const [search, setSearch] = useState(initialSearch || "");

  // Fetch tax forms with filters
  useEffect(() => {
    const fetchTaxForms = async () => {
      try {
        setLoading(true);
        const params = { page: currentPage };
        if (status) params.status = status;
        if (search) params.search = search;

        const response = await httpClient.get(API_PATHS.ADMIN.FORMS, {
          params,
        });

        setForms(response.data.forms);
        const pagination = transformPagination(response.data);
        setTotalPages(pagination.totalPages);
        setLoading(false);
      } catch (error) {
        handleApiErrorWithToast(
          error,
          "Failed to load tax forms. Please try again.",
          setError
        );
        setLoading(false);
      }
    };

    fetchTaxForms();
  }, [currentPage, status, search]);

  // Update URL when filters change
  useEffect(() => {
    const query = {};
    if (status) query.status = status;
    if (search) query.search = search;

    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true }
    );
  }, [status, search]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calculate pagination values
  const itemsPerPage = 10; // Assuming 10 items per page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle status filter change
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
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

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="bg-white shadow sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-primary-50 to-white">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded-md p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Tax Forms
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage and review all tax forms submitted by users. You can
                    filter by status and search by name or email.
                  </p>
                </div>
                <div className="flex-shrink-0 bg-gray-50 rounded-md p-2 flex items-center">
                  <span className="text-sm text-gray-500 mr-2">
                    Total Forms:
                  </span>
                  <span className="text-lg font-semibold text-primary-600">
                    {forms.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Filters and search */}
          <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <FunnelIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <h2 className="ml-2 text-lg font-medium text-gray-900">
                    Filters
                  </h2>
                </div>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <form onSubmit={handleSearch} className="flex w-full md:w-auto">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Search by name, email, or PAN"
                    />
                  </div>
                  <button
                    type="submit"
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <select
                  id="status"
                  name="status"
                  value={status}
                  onChange={handleStatusChange}
                  className="pl-10 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Filed">Filed</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                  <kbd className="inline-flex items-center border border-gray-200 rounded px-2 text-sm font-sans font-medium text-gray-400">
                    ⌘F
                  </kbd>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {status ? `Showing ${status} forms` : "Showing all forms"}
              </p>
            </div>
          </div>

          {/* Loading state */}
          {loading && <SectionLoading message="Loading tax forms..." />}

          {/* Error state */}
          {error && (
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
          )}

          {/* Tax forms list */}
          {!loading && !error && (
            <div className="mt-8 flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg bg-white">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Full Name
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Documents
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            PAN
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Email
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Submitted
                          </th>
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                          >
                            <span className="sr-only">View</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {forms.length > 0 ? (
                          forms.map((form) => (
                            <tr
                              key={form._id}
                              className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                              onClick={() =>
                                router.push(`/admin/tax-forms/${form._id}`)
                              }
                            >
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                {form.fullName}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <StatusBadge status={form.status} />
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <DocumentTextIcon className="-ml-0.5 mr-1.5 h-4 w-4 text-gray-500" />
                                  {form.documents?.length || 0} files
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                                {form.pan}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <a
                                  href={`mailto:${form.email}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-primary-600 hover:text-primary-900"
                                >
                                  {form.email}
                                </a>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {formatDate(form.createdAt)}
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <button
                                  type="button"
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/admin/tax-forms/${form._id}`);
                                  }}
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="7"
                              className="px-4 py-5 text-center text-gray-500"
                            >
                              No tax form submissions found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && forms.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-md shadow">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={endIndex >= forms.length}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{startIndex + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(endIndex, forms.length)}
                    </span>{" "}
                    of <span className="font-medium">{forms.length}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>

                    {/* Current page indicator */}
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 bg-primary-50">
                      {currentPage}
                    </span>

                    <button
                      onClick={handleNextPage}
                      disabled={endIndex >= forms.length}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAuth(TaxForms, "admin");
