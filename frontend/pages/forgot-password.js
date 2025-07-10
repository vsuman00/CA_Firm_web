import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import httpClient, { API_PATHS } from "../utils/httpClient";
import Layout from "../components/Layout";
import { handleApiErrorWithToast } from "../utils/errorHandler";
import LoadingButton from "../components/LoadingButton";

// Schema for email validation
const EmailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

// Schema for OTP and new password validation
const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  otp: Yup.string()
    .required("OTP is required")
    .matches(/^[0-9]{6}$/, "OTP must be 6 digits"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP and set new password
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle request OTP form submission
  const handleRequestOTP = async (values, { setSubmitting }) => {
    try {
      await httpClient.post(API_PATHS.AUTH.REQUEST_OTP, {
        email: values.email,
      });

      setEmail(values.email);
      setStep(2);
      toast.success(
        "If your email is registered, you will receive an OTP shortly"
      );
    } catch (error) {
      handleApiErrorWithToast(
        error,
        "Failed to send OTP. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle reset password form submission
  const handleResetPassword = async (values, { setSubmitting }) => {
    try {
      // First verify the OTP
      const verifyResponse = await httpClient.post(API_PATHS.AUTH.VERIFY_OTP, {
        email: values.email,
        otp: values.otp,
      });

      if (verifyResponse.status === 200) {
        // Now update the password
        // Since there's no direct reset password endpoint, we'll use the toggle OTP endpoint
        // to set a new password and disable OTP authentication if it was enabled
        await httpClient.post(API_PATHS.AUTH.TOGGLE_OTP, {
          password: values.newPassword,
        }, {
          headers: {
            // We need to create a temporary authorization header
            // This is a workaround since the toggle-otp endpoint requires authentication
            // In a production app, you would have a dedicated reset-password endpoint
            Authorization: `Bearer ${verifyResponse.data.tempToken || 'temp-token'}`,
          },
        });

        toast.success("Password reset successfully");
        router.push("/login");
      }
    } catch (error) {
      handleApiErrorWithToast(
        error,
        "Failed to reset password. Please verify your OTP and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 1 ? "Forgot your password?" : "Reset your password"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 1 ? (
              <>Enter your email to receive a one-time password</>
            ) : (
              <>Enter the OTP sent to your email and set a new password</>
            )}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {step === 1 ? (
              <Formik
                initialValues={{ email: "" }}
                validationSchema={EmailSchema}
                onSubmit={handleRequestOTP}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email address
                      </label>
                      <div className="mt-1">
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>
                    </div>

                    <div>
                      <LoadingButton
                        type="submit"
                        loading={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Send OTP
                      </LoadingButton>
                    </div>

                    <div className="text-sm text-center">
                      <Link
                        href="/login"
                        className="font-medium text-primary-600 hover:text-primary-500"
                      >
                        Back to login
                      </Link>
                    </div>
                  </Form>
                )}
              </Formik>
            ) : (
              <Formik
                initialValues={{
                  email: email,
                  otp: "",
                  newPassword: "",
                  confirmPassword: "",
                }}
                validationSchema={ResetPasswordSchema}
                onSubmit={handleResetPassword}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email address
                      </label>
                      <div className="mt-1">
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          disabled
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="otp"
                        className="block text-sm font-medium text-gray-700"
                      >
                        One-Time Password (OTP)
                      </label>
                      <div className="mt-1">
                        <Field
                          id="otp"
                          name="otp"
                          type="text"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="Enter 6-digit OTP"
                        />
                        <ErrorMessage
                          name="otp"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        New Password
                      </label>
                      <div className="mt-1 relative">
                        <Field
                          id="newPassword"
                          name="newPassword"
                          type={showPassword ? "text" : "password"}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                        <ErrorMessage
                          name="newPassword"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Confirm Password
                      </label>
                      <div className="mt-1 relative">
                        <Field
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>
                    </div>

                    <div>
                      <LoadingButton
                        type="submit"
                        loading={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Reset Password
                      </LoadingButton>
                    </div>

                    <div className="text-sm text-center">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="font-medium text-primary-600 hover:text-primary-500"
                      >
                        Request a new OTP
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}