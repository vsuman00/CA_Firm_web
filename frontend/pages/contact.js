import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import httpClient, { API_PATHS } from "../utils/httpClient";
import { handleApiErrorWithToast } from "../utils/errorHandler";
import LoadingButton from "../components/LoadingButton";

// Validation schema
const ContactSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  message: Yup.string()
    .required("Message is required")
    .min(10, "Message is too short"),
});

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      await httpClient.post(API_PATHS.FORMS.CONTACT, values);
      resetForm();
      setSubmitSuccess(true);
      toast.success("Message sent successfully!");
    } catch (error) {
      handleApiErrorWithToast(
        error,
        "Failed to send message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero section */}
      <div className="bg-primary-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Contact Us
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-primary-100">
            Get in touch with our team for any inquiries or assistance
          </p>
        </div>
      </div>

      {/* Contact section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Left column - Contact info */}
            <div className="lg:col-span-5">
              <h2 className="text-2xl font-bold text-gray-900">Get in Touch</h2>
              <p className="mt-4 text-lg text-gray-600">
                Have questions about our services? Need professional financial
                advice? Our team is here to help you.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <PhoneIcon
                      className="h-6 w-6 text-primary-500"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3 text-base text-gray-600">
                    <p>+91 95252 39747</p>
                    <p className="mt-1">Mon-Sat 10am to 7pm</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <EnvelopeIcon
                      className="h-6 w-6 text-primary-500"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3 text-base text-gray-600">
                    <p>krishoberoi1@gmail.com </p>
                    <p className="mt-1">We'll respond as soon as possible</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <MapPinIcon
                      className="h-6 w-6 text-primary-500"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3 text-base text-gray-600">
                    <p>211, NARAYAN PLAZA</p>
                    <p className="mt-1">
                      {" "}
                      EXHIBITION ROAD, PATNA, BIHAR-800001
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-lg font-medium text-gray-900">
                  Business Hours
                </h3>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Monday - Saturday</p>
                    <p className="text-gray-900 font-medium">
                      10:00 AM - 7:00 PM
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Sunday</p>
                    <p className="text-gray-900 font-medium">Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Contact form */}
            <div className="mt-12 lg:mt-0 lg:col-span-7">
              <div className="card">
                <div className="px-4 py-5 sm:p-6">
                  {submitSuccess ? (
                    <div className="text-center py-8">
                      <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
                      <h3 className="mt-3 text-xl font-medium text-gray-900">
                        Message Sent Successfully!
                      </h3>
                      <p className="mt-2 text-gray-600">
                        Thank you for contacting us. We'll get back to you as
                        soon as possible.
                      </p>
                      <button
                        type="button"
                        onClick={() => setSubmitSuccess(false)}
                        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Send us a Message
                      </h3>
                      <div className="mt-2 max-w-xl text-sm text-gray-500">
                        <p>
                          Fill out the form below and we'll get back to you as
                          soon as possible.
                        </p>
                      </div>

                      <Formik
                        initialValues={{
                          name: "",
                          email: "",
                          message: "",
                        }}
                        validationSchema={ContactSchema}
                        onSubmit={handleSubmit}
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
                              <Field
                                type="text"
                                name="name"
                                id="name"
                                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                  errors.name && touched.name
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                              />
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
                                Email Address
                              </label>
                              <Field
                                type="email"
                                name="email"
                                id="email"
                                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
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

                            <div>
                              <label
                                htmlFor="message"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Message
                              </label>
                              <Field
                                as="textarea"
                                name="message"
                                id="message"
                                rows={6}
                                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                  errors.message && touched.message
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                                placeholder="How can we help you?"
                              />
                              <ErrorMessage
                                name="message"
                                component="div"
                                className="mt-1 text-sm text-red-600"
                              />
                            </div>

                            <div>
                              <LoadingButton
                                type="submit"
                                loading={isSubmitting}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              >
                                Send Message
                              </LoadingButton>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
