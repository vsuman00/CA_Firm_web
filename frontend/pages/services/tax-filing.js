import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import {
  DocumentTextIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  XMarkIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";
import httpClient, { API_PATHS } from "../../utils/httpClient";
import { handleApiErrorWithToast } from "../../utils/errorHandler";
import { isAuthenticated, withAuth } from "../../utils/auth";
import LoadingButton from "../../components/LoadingButton";

// Validation schema
const TaxFilingSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  pan: Yup.string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format")
    .required("PAN is required"),
  hasIncomeTaxLogin: Yup.boolean(),
  itLoginId: Yup.string().when("hasIncomeTaxLogin", {
    is: true,
    then: () => Yup.string().required("IT Login ID is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  itLoginPassword: Yup.string().when("hasIncomeTaxLogin", {
    is: true,
    then: () => Yup.string().required("IT Login Password is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  hasHomeLoan: Yup.boolean(),
  homeLoanSanctionDate: Yup.string().when("hasHomeLoan", {
    is: true,
    then: () => Yup.string().required("Sanction date is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  homeLoanAmount: Yup.number().when("hasHomeLoan", {
    is: true,
    then: () =>
      Yup.number()
        .required("Total loan amount is required")
        .positive("Amount must be positive"),
    otherwise: () => Yup.number().notRequired(),
  }),
  homeLoanCurrentDue: Yup.number().when("hasHomeLoan", {
    is: true,
    then: () =>
      Yup.number()
        .required("Current due amount is required")
        .positive("Amount must be positive"),
    otherwise: () => Yup.number().notRequired(),
  }),
  homeLoanInterest: Yup.number().when("hasHomeLoan", {
    is: true,
    then: () =>
      Yup.number()
        .required("Total interest is required")
        .positive("Amount must be positive"),
    otherwise: () => Yup.number().notRequired(),
  }),
  hasPRAN: Yup.boolean(),
  pranNumber: Yup.string().when("hasPRAN", {
    is: true,
    then: () => Yup.string().required("PRAN number is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
});

function TaxFiling() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // State for file uploads
  const [fileUploads, setFileUploads] = useState({
    form16: null,
    bankStatements: null,
    investmentProof: null,
    tradingSummary: null,
    homeLoanCertificate: null,
    salarySlip: null,
    aadharCard: null,
    otherDocument: null,
  });

  // Authentication is now handled by withAuth HOC

  // File upload configuration
  const fileConfig = {
    accept: {
      "application/pdf": [".pdf"],
      "application/zip": [".zip"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: 10485760, // 10MB
  };

  // Special config for otherDocument with larger size limit
  const otherDocumentConfig = {
    accept: {
      "application/pdf": [".pdf"],
      "application/zip": [".zip"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: 52428800, // 50MB
  };

  // Create dropzone handlers for each file type
  const createDropzoneHandler = (fieldName, config = fileConfig) => {
    return useDropzone({
      ...config,
      maxFiles: 1,
      onDrop: (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
          setFileUploads((prev) => ({
            ...prev,
            [fieldName]: acceptedFiles[0],
          }));
        }
      },
    });
  };

  // Create dropzone handlers for each file field
  const form16Dropzone = createDropzoneHandler("form16");
  const bankStatementsDropzone = createDropzoneHandler("bankStatements");
  const investmentProofDropzone = createDropzoneHandler("investmentProof");
  const tradingSummaryDropzone = createDropzoneHandler("tradingSummary");
  const homeLoanCertificateDropzone = createDropzoneHandler(
    "homeLoanCertificate"
  );
  const salarySlipDropzone = createDropzoneHandler("salarySlip");
  const aadharCardDropzone = createDropzoneHandler("aadharCard");
  const otherDocumentDropzone = createDropzoneHandler(
    "otherDocument",
    otherDocumentConfig
  );

  // Remove file handler
  const removeFile = (fieldName) => {
    setFileUploads((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
  };

  // File upload component
  const FileUpload = ({
    dropzone,
    fieldName,
    label,
    required = false,
    file,
  }) => {
    const { getRootProps, getInputProps } = dropzone;
    const isOtherDocument = fieldName === "otherDocument";
    const maxSizeDisplay = isOtherDocument ? "50MB" : "10MB";

    return (
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div
          {...getRootProps()}
          className="mt-1 flex flex-col justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200 hover:border-primary-400"
        >
          <div className="space-y-2 text-center">
            <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400 group-hover:text-primary-500" />
            <p className="text-sm text-gray-600 font-medium">
              Drag & drop or click to upload
            </p>
            <p className="text-xs text-gray-500">
              PDF, ZIP, JPG, PNG up to {maxSizeDisplay}
            </p>
          </div>
          <input {...getInputProps()} />
        </div>
        {file && (
          <div className="mt-2 flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-2">
              <DocumentTextIcon className="h-5 w-5 text-primary-500" />
              <span className="text-sm text-gray-900 truncate max-w-xs">
                {file.name}
              </span>
              <span className="text-xs text-gray-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
            <button
              type="button"
              onClick={() => removeFile(fieldName)}
              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors duration-200"
              aria-label="Remove file"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = async (values, { resetForm }) => {
    // Check if user is authenticated before submitting
    if (!isAuthenticated()) {
      toast.error("You must be logged in to submit this form");
      router.push(`/login?returnUrl=${encodeURIComponent(router.asPath)}`);
      return;
    }

    // Validate required file uploads
    const requiredFiles = [
      { name: "form16", label: "Form 16" },
      { name: "bankStatements", label: "Bank Statements" },
      { name: "investmentProof", label: "Investment Proof" },
      { name: "salarySlip", label: "Salary Slip" },
      { name: "aadharCard", label: "AADHAR Card" },
    ];

    // Check if home loan certificate is required
    if (values.hasHomeLoan && !fileUploads.homeLoanCertificate) {
      requiredFiles.push({
        name: "homeLoanCertificate",
        label: "Home Loan Interest Certificate",
      });
    }

    // Validate required files
    const missingFiles = requiredFiles.filter(
      (file) => !fileUploads[file.name]
    );

    if (missingFiles.length > 0) {
      const missingFileNames = missingFiles
        .map((file) => file.label)
        .join(", ");
      toast.error(`Please upload required documents: ${missingFileNames}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Add form values
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      // Add files with specific field names
      Object.entries(fileUploads).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      await httpClient.post(API_PATHS.FORMS.TAX, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      resetForm();
      setFileUploads({
        form16: null,
        bankStatements: null,
        investmentProof: null,
        tradingSummary: null,
        homeLoanCertificate: null,
        salarySlip: null,
        aadharCard: null,
        otherDocument: null,
      });
      setSubmitSuccess(true);
      toast.success("Tax filing form submitted successfully!");

      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      handleApiErrorWithToast(
        error,
        "Failed to submit form. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-3 text-3xl font-extrabold text-gray-900">
            Form Submitted Successfully!
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Thank you for submitting your tax filing request. Our team will
            review your information and contact you soon.
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Return to Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero section */}
      <div className="bg-primary-700 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Tax Filing Services
          </h1>
          <p className="mt-4 text-xl text-primary-100">
            Professional tax preparation and filing services for individuals and
            businesses
          </p>
        </div>
      </div>

      {/* Content section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left: Service details */}
          <div className="lg:col-span-5">
            <h2 className="text-2xl font-bold text-gray-900">
              Our Tax Filing Services
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We provide comprehensive tax preparation and filing services to
              help you maximize your returns and ensure compliance with tax
              regulations.
            </p>
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900">
                Our Process
              </h3>
              <ul className="mt-4 space-y-4">
                {[
                  "Submit Your Information",
                  "Document Review",
                  "Tax Preparation",
                  "Filing and Follow-up",
                ].map((title, i) => (
                  <li className="flex" key={i}>
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary-500 text-white">
                        {i + 1}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-md font-medium text-gray-900">
                        {title}
                      </h4>
                      <p className="mt-1 text-sm text-gray-600">
                        {
                          [
                            "Fill out the form with your personal and financial details.",
                            "Our experts will review your documents and information.",
                            "We prepare your tax returns with maximum benefits.",
                            "We file your returns and provide support for any follow-up queries.",
                          ][i]
                        }
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Form */}
          <div className="mt-12 lg:mt-0 lg:col-span-7">
            <div className="bg-white py-10 px-6 shadow-lg sm:rounded-xl sm:px-12 border border-gray-100">
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <DocumentCheckIcon className="h-7 w-7 mr-2 text-primary-600" />
                  Tax Filing Request Form
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Fill out the form below to request our tax filing services.
                  Our team will review your submission and contact you shortly.
                </p>

                <Formik
                  initialValues={{
                    fullName: "",
                    email: "",
                    phone: "",
                    pan: "",
                    hasIncomeTaxLogin: false,
                    itLoginId: "",
                    itLoginPassword: "",
                    hasHomeLoan: false,
                    homeLoanSanctionDate: "",
                    homeLoanAmount: "",
                    homeLoanCurrentDue: "",
                    homeLoanInterest: "",
                    hasPRAN: false,
                    pranNumber: "",
                  }}
                  validationSchema={TaxFilingSchema}
                  onSubmit={handleSubmit}
                >
                  {({
                    isSubmitting: formikSubmitting,
                    errors,
                    touched,
                    values,
                    setFieldValue,
                  }) => (
                    <Form className="mt-5 space-y-6">
                      {/* Full Name */}
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Full Name
                        </label>
                        <Field
                          type="text"
                          name="fullName"
                          id="fullName"
                          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                            errors.fullName && touched.fullName
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        <ErrorMessage
                          name="fullName"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email Address
                        </label>
                        <Field
                          type="email"
                          name="email"
                          id="email"
                          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                            errors.email && touched.email
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone Number
                        </label>
                        <Field
                          type="text"
                          name="phone"
                          id="phone"
                          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                            errors.phone && touched.phone
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>

                      {/* PAN */}
                      <div>
                        <label
                          htmlFor="pan"
                          className="block text-sm font-medium text-gray-700"
                        >
                          PAN Number
                        </label>
                        <Field
                          type="text"
                          name="pan"
                          id="pan"
                          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                            errors.pan && touched.pan
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        <ErrorMessage
                          name="pan"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                        <p className="text-xs text-gray-500">
                          Format: ABCDE1234F
                        </p>
                      </div>

                      {/* Income Tax Login Credentials */}
                      <div className="mt-6">
                        <div className="flex items-center">
                          <Field
                            type="checkbox"
                            name="hasIncomeTaxLogin"
                            id="hasIncomeTaxLogin"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="hasIncomeTaxLogin"
                            className="ml-2 block text-sm font-medium text-gray-700"
                          >
                            Income Tax login credentials?
                          </label>
                        </div>

                        {values.hasIncomeTaxLogin && (
                          <div className="mt-3 ml-6 space-y-4">
                            {/* IT Login ID */}
                            <div>
                              <label
                                htmlFor="itLoginId"
                                className="block text-sm font-medium text-gray-700"
                              >
                                IT Login ID
                              </label>
                              <Field
                                type="text"
                                name="itLoginId"
                                id="itLoginId"
                                placeholder="Enter your IT Login ID"
                                value={
                                  values.pan ? values.pan : values.itLoginId
                                }
                                className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                  errors.itLoginId && touched.itLoginId
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                              />
                              <ErrorMessage
                                name="itLoginId"
                                component="div"
                                className="mt-1 text-sm text-red-600"
                              />
                            </div>

                            {/* IT Login Password */}
                            <div>
                              <label
                                htmlFor="itLoginPassword"
                                className="block text-sm font-medium text-gray-700"
                              >
                                IT Login Password
                              </label>
                              <Field
                                type="password"
                                name="itLoginPassword"
                                id="itLoginPassword"
                                placeholder="Enter your IT Login Password"
                                className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                  errors.itLoginPassword &&
                                  touched.itLoginPassword
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                              />
                              <ErrorMessage
                                name="itLoginPassword"
                                component="div"
                                className="mt-1 text-sm text-red-600"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Home Loan Interest Certificate */}
                      <div className="mt-6">
                        <div className="flex items-center">
                          <Field
                            type="checkbox"
                            name="hasHomeLoan"
                            id="hasHomeLoan"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="hasHomeLoan"
                            className="ml-2 block text-sm font-medium text-gray-700"
                          >
                            Home Loan Interest Certificate?
                          </label>
                        </div>

                        {values.hasHomeLoan && (
                          <div className="mt-3 ml-6 space-y-4">
                            {/* Sanction Date */}
                            <div>
                              <label
                                htmlFor="homeLoanSanctionDate"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Sanction Date (dd/mm/yyyy)
                              </label>
                              <Field
                                type="text"
                                name="homeLoanSanctionDate"
                                id="homeLoanSanctionDate"
                                placeholder="DD/MM/YYYY"
                                className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                  errors.homeLoanSanctionDate &&
                                  touched.homeLoanSanctionDate
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                              />
                              <ErrorMessage
                                name="homeLoanSanctionDate"
                                component="div"
                                className="mt-1 text-sm text-red-600"
                              />
                            </div>

                            {/* Total Loan Amount */}
                            <div>
                              <label
                                htmlFor="homeLoanAmount"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Total Loan Amount (INR)
                              </label>
                              <Field
                                type="number"
                                name="homeLoanAmount"
                                id="homeLoanAmount"
                                placeholder="Enter amount in INR"
                                className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                  errors.homeLoanAmount &&
                                  touched.homeLoanAmount
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                              />
                              <ErrorMessage
                                name="homeLoanAmount"
                                component="div"
                                className="mt-1 text-sm text-red-600"
                              />
                            </div>

                            {/* Current Due Amount */}
                            <div>
                              <label
                                htmlFor="homeLoanCurrentDue"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Current Due Amount (INR)
                              </label>
                              <Field
                                type="number"
                                name="homeLoanCurrentDue"
                                id="homeLoanCurrentDue"
                                placeholder="Enter amount in INR"
                                className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                  errors.homeLoanCurrentDue &&
                                  touched.homeLoanCurrentDue
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                              />
                              <ErrorMessage
                                name="homeLoanCurrentDue"
                                component="div"
                                className="mt-1 text-sm text-red-600"
                              />
                            </div>

                            {/* Total Interest */}
                            <div>
                              <label
                                htmlFor="homeLoanInterest"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Total Interest (INR)
                              </label>
                              <Field
                                type="number"
                                name="homeLoanInterest"
                                id="homeLoanInterest"
                                placeholder="Enter amount in INR"
                                className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                  errors.homeLoanInterest &&
                                  touched.homeLoanInterest
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                              />
                              <ErrorMessage
                                name="homeLoanInterest"
                                component="div"
                                className="mt-1 text-sm text-red-600"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* PRAN Number */}
                      <div className="mt-6">
                        <div className="flex items-center">
                          <Field
                            type="checkbox"
                            name="hasPRAN"
                            id="hasPRAN"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="hasPRAN"
                            className="ml-2 block text-sm font-medium text-gray-700"
                          >
                            PRAN No of NPS?
                          </label>
                        </div>

                        {values.hasPRAN && (
                          <div className="mt-3 ml-6">
                            <Field
                              type="text"
                              name="pranNumber"
                              id="pranNumber"
                              placeholder="Enter your PRAN number"
                              className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                errors.pranNumber && touched.pranNumber
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                            <ErrorMessage
                              name="pranNumber"
                              component="div"
                              className="mt-1 text-sm text-red-600"
                            />
                          </div>
                        )}
                      </div>

                      {/* Document Uploads Section */}
                      <div className="mt-10 pt-6 border-t border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                          <DocumentTextIcon className="h-6 w-6 mr-2 text-primary-500" />
                          Required Documents
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                          Please upload the following documents in PDF, ZIP,
                          JPG, or PNG format.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Form 16 */}
                          <FileUpload
                            dropzone={form16Dropzone}
                            fieldName="form16"
                            label="Form 16"
                            required={true}
                            file={fileUploads.form16}
                          />

                          {/* Bank Statements */}
                          <FileUpload
                            dropzone={bankStatementsDropzone}
                            fieldName="bankStatements"
                            label="Bank Statements"
                            required={true}
                            file={fileUploads.bankStatements}
                          />

                          {/* Investment Proof */}
                          <FileUpload
                            dropzone={investmentProofDropzone}
                            fieldName="investmentProof"
                            label="Investment Proof (FY 2024–25)"
                            required={true}
                            file={fileUploads.investmentProof}
                          />

                          {/* Trading Summary */}
                          <FileUpload
                            dropzone={tradingSummaryDropzone}
                            fieldName="tradingSummary"
                            label="Trading summary / P&L account (01-04-2024 to 31-03-2025)"
                            file={fileUploads.tradingSummary}
                          />

                          {/* Home Loan Certificate (conditional) */}
                          {values.hasHomeLoan && (
                            <FileUpload
                              dropzone={homeLoanCertificateDropzone}
                              fieldName="homeLoanCertificate"
                              label="Home Loan Interest Certificate"
                              required={true}
                              file={fileUploads.homeLoanCertificate}
                            />
                          )}

                          {/* Salary Slip */}
                          <FileUpload
                            dropzone={salarySlipDropzone}
                            fieldName="salarySlip"
                            label="Salary Slip (March 2025)"
                            required={true}
                            file={fileUploads.salarySlip}
                          />

                          {/* AADHAR Card */}
                          <FileUpload
                            dropzone={aadharCardDropzone}
                            fieldName="aadharCard"
                            label="AADHAR Card (Both sides)"
                            required={true}
                            file={fileUploads.aadharCard}
                          />

                          {/* Other Document */}
                          <FileUpload
                            dropzone={otherDocumentDropzone}
                            fieldName="otherDocument"
                            label="Any other document"
                            file={fileUploads.otherDocument}
                          />
                        </div>
                      </div>

                      {/* Submit */}
                      <div className="mt-10 pt-6 border-t border-gray-200">
                        <LoadingButton
                          type="submit"
                          loading={isSubmitting || formikSubmitting}
                          className="w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                        >
                          Submit Tax Filing Request
                        </LoadingButton>
                        <p className="mt-3 text-center text-sm text-gray-500">
                          By submitting this form, you agree to our{" "}
                          <a
                            href="/terms"
                            className="text-primary-600 hover:text-primary-500"
                          >
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a
                            href="/privacy"
                            className="text-primary-600 hover:text-primary-500"
                          >
                            Privacy Policy
                          </a>
                        </p>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Export with authentication protection
export default withAuth(TaxFiling);
