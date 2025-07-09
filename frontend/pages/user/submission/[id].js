import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../../components/Layout";
import { withAuth } from "../../../utils/auth";
import httpClient, { API_PATHS } from "../../../utils/httpClient";
import { handleApiErrorWithToast } from "../../../utils/errorHandler";
import { SectionLoading } from "../../../components/LoadingState";
import { getFileUrl, formatFileSize, downloadDocumentWithAuth } from "../../../utils/fileUtils";
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

function SubmissionDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch submission details
    const fetchSubmission = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await httpClient.get(
          API_PATHS.FORMS.USER_SUBMISSION_DETAIL(id)
        );
        setSubmission(response.data);
      } catch (error) {
        handleApiErrorWithToast(error, "Failed to load submission details");
        setError("Failed to load submission details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [id]);

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-yellow-400" />
            Pending
          </span>
        );
      case "In Review":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <DocumentTextIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-blue-400" />
            In Review
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-green-400" />
            Completed
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <ExclamationCircleIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-red-400" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <SectionLoading />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
          <button
            onClick={() => router.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  if (!submission) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Submission not found</p>
            <Link 
              href="/user/submissions" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to Submissions
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Helper function to render file download link
  const renderFileDownload = (file, label) => {
    if (!file) return null;

    return (
      <div className="py-3 flex justify-between text-sm font-medium">
        <div className="w-1/4 text-gray-500">{label}</div>
        <div className="w-3/4 text-gray-900">
          <button
            onClick={() => downloadDocumentWithAuth(file._id, file.originalName)}
            className="inline-flex items-center text-primary-600 hover:text-primary-900"
          >
            <span className="truncate">{file.originalName}</span>
            <span className="ml-1 text-gray-500">
              ({formatFileSize(file.fileSize)})
            </span>
            <ArrowDownTrayIcon className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link 
              href="/user/submissions" 
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-900 mb-4"
            >
              <ArrowLeftIcon className="mr-1 h-4 w-4" />
              Back to Submissions
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">
              Submission Details
            </h1>
            <div className="mt-2 flex items-center">
              <p className="text-sm text-gray-500 mr-2">Status:</p>
              {getStatusBadge(submission.status)}
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 bg-primary-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Personal Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Submitted on {formatDate(submission.createdAt)}
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <IdentificationIcon className="mr-1 h-5 w-5 text-gray-400" />
                    Full name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {submission.fullName}
                  </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <EnvelopeIcon className="mr-1 h-5 w-5 text-gray-400" />
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {submission.email}
                  </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <PhoneIcon className="mr-1 h-5 w-5 text-gray-400" />
                    Phone number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {submission.phone}
                  </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <DocumentTextIcon className="mr-1 h-5 w-5 text-gray-400" />
                    PAN
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {submission.pan}
                  </dd>
                </div>
                {submission.hasPRAN && (
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      PRAN Number
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {submission.pranNumber}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-primary-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Uploaded Documents
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Click on a document to download
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="sm:divide-y sm:divide-gray-200">
                {renderFileDownload(submission.form16, "Form 16")}
                {renderFileDownload(
                  submission.bankStatements,
                  "Bank Statements"
                )}
                {renderFileDownload(
                  submission.investmentProof,
                  "Investment Proof"
                )}
                {renderFileDownload(
                  submission.tradingSummary,
                  "Trading Summary"
                )}
                {renderFileDownload(
                  submission.homeLoanCertificate,
                  "Home Loan Certificate"
                )}
                {renderFileDownload(submission.salarySlip, "Salary Slip")}
                {renderFileDownload(submission.aadharCard, "AADHAR Card")}
                {renderFileDownload(submission.otherDocument, "Other Document")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(SubmissionDetail, "user");
