import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import httpClient, { API_PATHS } from "../utils/httpClient";
import { setAuth } from "../utils/auth";
import Layout from "../components/Layout";
import { handleApiErrorWithToast } from "../utils/errorHandler";
import LoadingButton from "../components/LoadingButton";

// Schema for password-based login
const PasswordLoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

// Schema for OTP-based login
const OtpLoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  otp: Yup.string()
    .required("OTP is required")
    .matches(/^[0-9]{6}$/, "OTP must be 6 digits"),
});

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState("password"); // "password" or "otp"
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);

  // Handle login form submission
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Prepare login payload based on login method
      const payload = {
        email: values.email,
        role: "user", // Specify user role
      };

      // Add either password or OTP based on login method
      if (loginMethod === "password") {
        payload.password = values.password;
      } else {
        payload.otp = values.otp;
      }

      const response = await httpClient.post(API_PATHS.AUTH.LOGIN, payload);

      if (response.data.token) {
        // Store the token and user info
        setAuth(response.data.token, response.data.user);
        toast.success("Login successful!");
        router.push("/user/dashboard");
      }
    } catch (error) {
      // Check if the error is due to wrong authentication method
      if (error.response?.data?.authMethod) {
        setLoginMethod(error.response.data.authMethod);
        setErrors({
          auth: error.response.data.message,
        });
      } else {
        handleApiErrorWithToast(error, "Failed to login. Please try again.");
        setErrors({
          auth:
            error.response?.data?.message ||
            "Failed to login. Please try again.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle requesting OTP
  const handleRequestOtp = async (email) => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setIsRequestingOtp(true);
      await httpClient.post(API_PATHS.AUTH.REQUEST_OTP, { email });
      toast.success("OTP sent to your email");
      setOtpRequested(true);
    } catch (error) {
      handleApiErrorWithToast(error, "Failed to send OTP. Please try again.");
    } finally {
      setIsRequestingOtp(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Formik
              initialValues={{ email: "", password: "", otp: "" }}
              validationSchema={
                loginMethod === "password"
                  ? PasswordLoginSchema
                  : OtpLoginSchema
              }
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors }) => (
                <Form className="space-y-6">
                  {errors.auth && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            {errors.auth}
                          </h3>
                        </div>
                      </div>
                    </div>
                  )}

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

                  {loginMethod === "password" ? (
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Password
                      </label>
                      <div className="mt-1 relative">
                        <Field
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
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
                          name="password"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center">
                        <label
                          htmlFor="otp"
                          className="block text-sm font-medium text-gray-700"
                        >
                          One-Time Password (OTP)
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const email =
                              document.getElementById("email").value;
                            handleRequestOtp(email);
                          }}
                          className="text-xs text-primary-600 hover:text-primary-500"
                          disabled={isRequestingOtp}
                        >
                          {isRequestingOtp
                            ? "Sending..."
                            : otpRequested
                            ? "Resend OTP"
                            : "Request OTP"}
                        </button>
                      </div>
                      <div className="mt-1">
                        <Field
                          id="otp"
                          name="otp"
                          type="text"
                          maxLength="6"
                          placeholder="Enter 6-digit OTP"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                        <ErrorMessage
                          name="otp"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      {loginMethod === "password" ? (
                        <Link
                          href="/forgot-password"
                          className="font-medium text-primary-600 hover:text-primary-500"
                        >
                          Forgot your password?
                        </Link>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        setLoginMethod(
                          loginMethod === "password" ? "otp" : "password"
                        )
                      }
                      className="text-sm text-primary-600 hover:text-primary-500"
                    >
                      {loginMethod === "password"
                        ? "Use one-time password (OTP) instead"
                        : "Use password instead"}
                    </button>
                  </div>

                  <div>
                    <LoadingButton
                      type="submit"
                      loading={isSubmitting}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Sign in
                    </LoadingButton>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </Layout>
  );
}
