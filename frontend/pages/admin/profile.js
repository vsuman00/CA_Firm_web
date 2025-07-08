import { useState, useEffect } from "react";
import { withAuth } from "../../utils/auth";
import AdminLayout from "../../components/AdminLayout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast from "react-hot-toast";
import {
  UserIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  ProfileSchema,
  PasswordChangeSchema,
} from "../../utils/validationSchemas";
import { handleApiErrorWithToast } from "../../utils/errorHandler";
import { SectionLoading, LoadingButton } from "../../components/LoadingState";
import httpClient, { API_PATHS } from "../../utils/httpClient";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await httpClient.get(API_PATHS.AUTH.ME);
        setUser(response.data);

        // Store user info in localStorage for use in other components
        localStorage.setItem("userInfo", JSON.stringify(response.data));
      } catch (error) {
        handleApiErrorWithToast(error, "Failed to load user profile");
        setError("Failed to load user profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfileUpdate = async (values) => {
    try {
      setUpdatingProfile(true);
      const response = await httpClient.put("/api/auth/profile", values);

      // Update local state
      setUser(response.data);

      // Update localStorage
      localStorage.setItem("userInfo", JSON.stringify(response.data));

      toast.success("Profile updated successfully!");
    } catch (error) {
      handleApiErrorWithToast(error, "Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = async (values, { resetForm }) => {
    try {
      setUpdatingPassword(true);
      await httpClient.put("/api/auth/password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      resetForm();
      toast.success("Password updated successfully!");
    } catch (error) {
      handleApiErrorWithToast(error, "Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <SectionLoading />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !user) {
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
                    {error || "User profile not found"}
                  </p>
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
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Profile Information */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Profile Information
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Update your account information.</p>
                </div>

                <Formik
                  initialValues={{
                    name: user.name || "",
                    email: user.email || "",
                  }}
                  validationSchema={ProfileSchema}
                  onSubmit={handleProfileUpdate}
                >
                  {({ errors, touched }) => (
                    <Form className="mt-5 space-y-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Name
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <Field
                            type="text"
                            name="name"
                            id="name"
                            className={`pl-10 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md ${
                              errors.name && touched.name
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                        </div>
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                          </div>
                          <Field
                            type="email"
                            name="email"
                            id="email"
                            className={`pl-10 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md ${
                              errors.email && touched.email
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                        </div>
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>

                      <div>
                        <LoadingButton
                          type="submit"
                          isLoading={updatingProfile}
                          loadingText="Updating..."
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          Update Profile
                        </LoadingButton>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Change Password
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Update your password.</p>
                </div>

                <Formik
                  initialValues={{
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  }}
                  validationSchema={PasswordChangeSchema}
                  onSubmit={handlePasswordUpdate}
                >
                  {({ errors, touched }) => (
                    <Form className="mt-5 space-y-6">
                      <div>
                        <label
                          htmlFor="currentPassword"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Current Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <KeyIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <Field
                            type="password"
                            name="currentPassword"
                            id="currentPassword"
                            className={`pl-10 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md ${
                              errors.currentPassword && touched.currentPassword
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                        </div>
                        <ErrorMessage
                          name="currentPassword"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="newPassword"
                          className="block text-sm font-medium text-gray-700"
                        >
                          New Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <KeyIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <Field
                            type="password"
                            name="newPassword"
                            id="newPassword"
                            className={`pl-10 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md ${
                              errors.newPassword && touched.newPassword
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                        </div>
                        <ErrorMessage
                          name="newPassword"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Confirm New Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <KeyIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <Field
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            className={`pl-10 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md ${
                              errors.confirmPassword && touched.confirmPassword
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                        </div>
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>

                      <div>
                        <LoadingButton
                          type="submit"
                          isLoading={updatingPassword}
                          loadingText="Updating..."
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          Change Password
                        </LoadingButton>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAuth(Profile, "admin");
