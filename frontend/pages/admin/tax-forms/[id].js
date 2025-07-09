import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { withAuth } from "../../../utils/auth";
import AdminLayout from "../../../components/AdminLayout";
import toast from "react-hot-toast";
import { SectionLoading } from "../../../components/LoadingState";
import { getFileUrl, formatFileSize, downloadDocumentWithAuth } from "../../../utils/fileUtils";
import { handleApiErrorWithToast } from "../../../utils/errorHandler";
import { transformTaxFormResponse } from "../../../utils/transformers";
import httpClient, { API_PATHS } from "../../../utils/httpClient";
import {
  DocumentTextIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";

function TaxFormDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    // Fetch tax form details
    const fetchTaxForm = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await httpClient.get(API_PATHS.ADMIN.FORM_DETAIL(id));
        setForm(transformTaxFormResponse(response.data));
        setLoading(false);
      } catch (error) {
        handleApiErrorWithToast(
          error,
          "Failed to load tax form details. Please try again.",
          setError
        );
        setLoading(false);
      }
    };

    fetchTaxForm();
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Note: formatFileSize is now imported from fileUtils

  // Handle status update
  const updateStatus = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      await httpClient.put(API_PATHS.ADMIN.FORM_STATUS(id), {
        status: newStatus,
      });

      // Update local state
      setForm((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      handleApiErrorWithToast(
        error,
        "Failed to update status. Please try again."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handle document download
  const downloadDocument = (document) => {
    // Use the authenticated download function instead of window.open
    downloadDocumentWithAuth(document._id, document.originalName);
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
        icon = <ClockIcon className="h-5 w-5 mr-1" />;
        break;
      case "Reviewed":
        bgColor = "bg-blue-100";
        textColor = "text-blue-800";
        icon = <ExclamationCircleIcon className="h-5 w-5 mr-1" />;
        break;
      case "Filed":
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        icon = <CheckCircleIcon className="h-5 w-5 mr-1" />;
        break;
      default:
        bgColor = "bg-gray-100";
        textColor = "text-gray-800";
    }

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}
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
            <SectionLoading message="Loading tax form details..." />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !form) {
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
                  <p className="text-sm text-red-700">
                    {error || "Tax form not found"}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => router.push("/admin/tax-forms")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                <ArrowLeftIcon
                  className="-ml-1 mr-2 h-5 w-5"
                  aria-hidden="true"
                />
                Back to Tax Forms
              </button>
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
          {/* Back button */}
          <div className="mb-5">
            <button
              onClick={() => router.push("/admin/tax-forms")}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowLeftIcon
                className="-ml-1 mr-1 h-4 w-4"
                aria-hidden="true"
              />
              Back to Tax Forms
            </button>
          </div>

          <div className="bg-white shadow sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-primary-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-100 rounded-md p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h1 className="text-2xl font-bold text-gray-900">Tax Form Details</h1>
                    <p className="mt-1 text-sm text-gray-500">
                      Form ID: <span className="font-medium text-gray-700">{form._id}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <StatusBadge status={form.status} />
                  <button
                    onClick={() => router.push('/admin/tax-forms')}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <ArrowLeftIcon className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
                    Back to List
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Main content */}
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            {/* Personal Information */}
            <div className="px-4 py-5 sm:px-6 border-t border-gray-200 bg-white">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Details provided by the applicant for tax filing purposes.
              </p>

              <div className="mt-6 overflow-hidden bg-white shadow sm:rounded-lg">
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6 bg-gray-50">
                      <dt className="text-sm font-medium text-gray-500">Full name</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 font-medium">
                        {form.fullName || "Not provided"}
                      </dd>
                    </div>

                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Email address</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <a href={`mailto:${form.email}`} className="text-primary-600 hover:text-primary-900">
                          {form.email || "Not provided"}
                        </a>
                      </dd>
                    </div>

                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6 bg-gray-50">
                      <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <a href={`tel:${form.phone}`} className="text-primary-600 hover:text-primary-900">
                          {form.phone || "Not provided"}
                        </a>
                      </dd>
                    </div>

                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">PAN</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 font-medium">
                        {form.pan || "Not provided"}
                      </dd>
                    </div>

                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6 bg-gray-50">
                      <dt className="text-sm font-medium text-gray-500">
                        Salary/Income Information
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <div className="whitespace-pre-wrap">{form.salaryInfo || "Not provided"}</div>
                      </dd>
                    </div>

                    {form.hasIncomeTaxLogin && (
                      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Income Tax Login Credentials
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          <div>
                            <span className="font-medium">Login ID:</span> {form.incomeTaxLoginId || "Not provided"}
                          </div>
                          <div className="mt-1">
                            <span className="font-medium">Password:</span> {form.incomeTaxLoginPassword ? "••••••••" : "Not provided"}
                          </div>
                        </dd>
                      </div>
                    )}

                    {form.hasHomeLoan && (
                      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6 bg-gray-50">
                        <dt className="text-sm font-medium text-gray-500">
                          Home Loan Details
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          <div className="grid grid-cols-1 gap-2">
                            <div>
                              <span className="font-medium">Sanction Date:</span> {form.homeLoanSanctionDate || "Not provided"}
                            </div>
                            <div>
                              <span className="font-medium">Loan Amount:</span> {form.homeLoanAmount || "Not provided"}
                            </div>
                            <div>
                              <span className="font-medium">Current Due Amount:</span> {form.homeLoanCurrentDue || "Not provided"}
                            </div>
                            <div>
                              <span className="font-medium">Total Interest:</span> {form.homeLoanTotalInterest || "Not provided"}
                            </div>
                          </div>
                        </dd>
                      </div>
                    )}

                    {form.hasNPS && (
                      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          PRAN No of NPS
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 font-medium">
                          {form.pranNo || "Not provided"}
                        </dd>
                      </div>
                    )}

                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6 bg-gray-50">
                      <dt className="text-sm font-medium text-gray-500">
                        Submission Date
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {formatDate(form.createdAt)}
                      </dd>
                    </div>

                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Last Updated
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {formatDate(form.updatedAt)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="px-4 py-5 sm:px-6 border-t border-gray-200 bg-gray-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Documents
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Files uploaded by the applicant. Other documents can be up to 50MB in size.
              </p>

              <div className="mt-6">
                {form.documents && form.documents.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {form.documents.map((doc, index) => {
                      // Determine document type for icon color
                      const isOtherDocument = doc.documentType === 'other';
                      const docTypeColor = isOtherDocument ? 'text-purple-500' : 'text-primary-500';
                      
                      // Format file size
                      const fileSizeInMB = doc.fileSize ? (doc.fileSize / (1024 * 1024)).toFixed(2) + ' MB' : 'Unknown size';
                      
                      // Get file extension
                      const fileExt = doc.originalName ? doc.originalName.split('.').pop().toUpperCase() : '';
                      
                      return (
                        <div
                          key={index}
                          className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 rounded-md bg-${isOtherDocument ? 'purple' : 'primary'}-100 p-2`}>
                              <DocumentTextIcon
                                className={`h-6 w-6 ${docTypeColor}`}
                                aria-hidden="true"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate" title={doc.originalName}>
                                {doc.originalName}
                              </p>
                              <div className="mt-1 flex items-center space-x-2">
                                <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                                  {fileExt}
                                </span>
                                <span className="text-xs text-gray-500">{fileSizeInMB}</span>
                              </div>
                              <div className="mt-3">
                                <button
                                  onClick={() => downloadDocument(doc)}
                                  className="inline-flex w-full justify-center items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                                >
                                  <ArrowDownTrayIcon
                                    className="-ml-0.5 mr-1.5 h-4 w-4"
                                    aria-hidden="true"
                                  />
                                  Download File
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-md bg-yellow-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">No documents available</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>The applicant has not uploaded any documents yet.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status update */}
            <div className="px-4 py-5 sm:px-6 border-t border-gray-200 bg-gray-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Update Status
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Change the current status of this tax filing. Current status: <span className="font-medium">{form.status}</span>
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className={`relative rounded-lg border ${form.status === "Pending" ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-white'} p-4 shadow-sm`}>
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 rounded-full p-1 ${form.status === "Pending" ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                      <ClockIcon className={`h-6 w-6 ${form.status === "Pending" ? 'text-yellow-600' : 'text-gray-400'}`} />
                    </div>
                    <div className="ml-4">
                      <h4 className={`text-base font-medium ${form.status === "Pending" ? 'text-yellow-900' : 'text-gray-900'}`}>Pending</h4>
                      <p className="mt-1 text-sm text-gray-500">Initial submission awaiting review</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => updateStatus("Pending")}
                      disabled={form.status === "Pending" || updatingStatus}
                      className={`w-full inline-flex justify-center items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm ${form.status === "Pending" ? 'border-yellow-300 text-yellow-700 bg-yellow-100 cursor-not-allowed' : 'border-transparent text-white bg-yellow-600 hover:bg-yellow-700'} ${updatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {form.status === "Pending" ? 'Current Status' : 'Mark as Pending'}
                    </button>
                  </div>
                </div>

                <div className={`relative rounded-lg border ${form.status === "Reviewed" ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'} p-4 shadow-sm`}>
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 rounded-full p-1 ${form.status === "Reviewed" ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <ExclamationCircleIcon className={`h-6 w-6 ${form.status === "Reviewed" ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <div className="ml-4">
                      <h4 className={`text-base font-medium ${form.status === "Reviewed" ? 'text-blue-900' : 'text-gray-900'}`}>Reviewed</h4>
                      <p className="mt-1 text-sm text-gray-500">Documents checked and verified</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => updateStatus("Reviewed")}
                      disabled={form.status === "Reviewed" || updatingStatus}
                      className={`w-full inline-flex justify-center items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm ${form.status === "Reviewed" ? 'border-blue-300 text-blue-700 bg-blue-100 cursor-not-allowed' : 'border-transparent text-white bg-blue-600 hover:bg-blue-700'} ${updatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {form.status === "Reviewed" ? 'Current Status' : 'Mark as Reviewed'}
                    </button>
                  </div>
                </div>

                <div className={`relative rounded-lg border ${form.status === "Filed" ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'} p-4 shadow-sm`}>
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 rounded-full p-1 ${form.status === "Filed" ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <CheckCircleIcon className={`h-6 w-6 ${form.status === "Filed" ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <div className="ml-4">
                      <h4 className={`text-base font-medium ${form.status === "Filed" ? 'text-green-900' : 'text-gray-900'}`}>Filed</h4>
                      <p className="mt-1 text-sm text-gray-500">Tax return successfully filed</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => updateStatus("Filed")}
                      disabled={form.status === "Filed" || updatingStatus}
                      className={`w-full inline-flex justify-center items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm ${form.status === "Filed" ? 'border-green-300 text-green-700 bg-green-100 cursor-not-allowed' : 'border-transparent text-white bg-green-600 hover:bg-green-700'} ${updatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {form.status === "Filed" ? 'Current Status' : 'Mark as Filed'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAuth(TaxFormDetail, "admin");
