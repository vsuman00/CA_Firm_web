import { useState } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast from "react-hot-toast";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { setAuth } from "../../utils/auth";
import { LoginSchema } from "../../utils/validationSchemas";
import { handleApiErrorWithToast } from "../../utils/errorHandler";
import { LoadingButton } from "../../components/LoadingState";
import httpClient, { API_PATHS } from "../../utils/httpClient";

export default function Login() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await httpClient.post(API_PATHS.AUTH.LOGIN, {
        ...values,
        role: "admin", // Specify admin role
      });

      // Store the token and user info
      setAuth(response.data.token, response.data.user);
      toast.success("Login successful!");
      router.push("/admin/dashboard");
    } catch (error) {
      handleApiErrorWithToast(
        error,
        "Login failed. Please check your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access the admin dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
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
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.email && touched.email
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.password && touched.password
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>
                </div>

                <div>
                  <LoadingButton
                    type="submit"
                    loading={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center">
                      <LockClosedIcon
                        className="-ml-1 mr-2 h-4 w-4"
                        aria-hidden="true"
                      />
                      Sign in
                    </span>
                  </LoadingButton>
                </div>
              </Form>
            )}
          </Formik>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Default credentials
                </span>
              </div>
            </div>

            <div className="mt-6">
              <div className="rounded-md bg-gray-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">
                      Email:{" "}
                      <span className="font-mono font-medium">
                        admin@comfinancial.com
                      </span>
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      Password:{" "}
                      <span className="font-mono font-medium">admin123</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Note: These are default credentials for demo purposes
                      only. Please change them after first login.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
