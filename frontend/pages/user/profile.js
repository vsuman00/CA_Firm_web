import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import { withAuth } from "../../utils/auth";
import {
  ProfileSchema,
  PasswordChangeSchema,
} from "../../utils/validationSchemas";
import { handleApiErrorWithToast } from "../../utils/errorHandler";
import { SectionLoading, LoadingButton } from "../../components/LoadingState";
import httpClient, { API_PATHS } from "../../utils/httpClient";

function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await httpClient.get(API_PATHS.AUTH.ME);
        setUser(response.data);
      } catch (error) {
        handleApiErrorWithToast(error, "Failed to load user data");
        setError("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileUpdate = async (values, { setSubmitting }) => {
    try {
      const response = await httpClient.put("/api/auth/profile", {
        name: values.name,
        email: values.email,
        pan: values.pan,
        mobile: values.mobile,
      });

      setUser(response.data);
      toast.success("Profile updated successfully");
      
      // Redirect to dashboard to show updated information
      router.push("/user/dashboard");
    } catch (error) {
      handleApiErrorWithToast(error, "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordUpdate = async (values, { setSubmitting, resetForm }) => {
    try {
      await httpClient.put("/api/auth/password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      toast.success("Password updated successfully");
      resetForm();
    } catch (error) {
      handleApiErrorWithToast(error, "Failed to update password");
    } finally {
      setSubmitting(false);
    }
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
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            User Profile
          </h1>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 bg-primary-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Profile Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Update your personal details
              </p>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <Formik
                initialValues={{
                  name: user?.name || "",
                  email: user?.email || "",
                  pan: user?.pan || "",
                  mobile: user?.mobile || "",
                }}
                validationSchema={ProfileSchema}
                onSubmit={handleProfileUpdate}
                enableReinitialize
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <div className="mt-1">
                        <Field
                          id="name"
                          name="name"
                          type="text"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </label>
                      <div className="mt-1">
                        <Field
                          id="email"
                          name="email"
                          type="email"
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
                      <label
                        htmlFor="pan"
                        className="block text-sm font-medium text-gray-700"
                      >
                        PAN Number
                      </label>
                      <div className="mt-1">
                        <Field
                          id="pan"
                          name="pan"
                          type="text"
                          placeholder="ABCDE1234F"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                        <ErrorMessage
                          name="pan"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="mobile"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mobile Number
                      </label>
                      <div className="mt-1">
                        <Field
                          id="mobile"
                          name="mobile"
                          type="text"
                          placeholder="10-digit mobile number"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                        <ErrorMessage
                          name="mobile"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>
                    </div>

                    <div>
                      <LoadingButton
                        type="submit"
                        isLoading={isSubmitting}
                        loadingText="Updating..."
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Update Profile
                      </LoadingButton>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-primary-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Change Password
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Update your password
              </p>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <Formik
                initialValues={{
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                }}
                validationSchema={PasswordChangeSchema}
                onSubmit={handlePasswordUpdate}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Current Password
                      </label>
                      <div className="mt-1 relative">
                        <Field
                          id="currentPassword"
                          name="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                        >
                          {showCurrentPassword ? "Hide" : "Show"}
                        </button>
                        <ErrorMessage
                          name="currentPassword"
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
                          type={showNewPassword ? "text" : "password"}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? "Hide" : "Show"}
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
                        Confirm New Password
                      </label>
                      <div className="mt-1">
                        <Field
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showNewPassword ? "text" : "password"}
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
                        isLoading={isSubmitting}
                        loadingText="Updating..."
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </Layout>
  );
}

export default withAuth(UserProfile, "user");
