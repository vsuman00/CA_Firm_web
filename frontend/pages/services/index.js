import { useState } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import {
  DocumentTextIcon,
  IdentificationIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

// Service data
const services = [
  {
    id: "tax-filing",
    name: "Tax Filing",
    description:
      "Professional tax preparation and filing services for individuals and businesses.",
    icon: DocumentTextIcon,
    href: "/user/tax-filing",
    features: [
      "Personal income tax returns",
      "Business tax returns",
      "Tax planning and consultation",
      "Electronic filing",
      "Year-round support",
    ],
  },
  {
    id: "gst-registration",
    name: "GST Registration",
    description:
      "Complete GST registration and compliance services for your business.",
    icon: IdentificationIcon,
    href: "#",
    features: [
      "GST registration assistance",
      "Monthly/quarterly GST filing",
      "GST reconciliation",
      "Input tax credit optimization",
      "GST audit support",
    ],
  },
  {
    id: "company-incorporation",
    name: "Company Incorporation",
    description: "End-to-end company formation and registration services.",
    icon: BuildingOfficeIcon,
    href: "#",
    features: [
      "Business structure consultation",
      "Company name reservation",
      "Registration with authorities",
      "Obtaining necessary licenses",
      "Post-incorporation compliance",
    ],
  },
  {
    id: "financial-auditing",
    name: "Financial Auditing",
    description:
      "Comprehensive financial auditing services to ensure compliance and accuracy.",
    icon: ChartBarIcon,
    href: "#",
    features: [
      "Statutory audits",
      "Internal audits",
      "Compliance audits",
      "Financial statement preparation",
      "Risk assessment",
    ],
  },
];

export default function Services() {
  return (
    <Layout>
      {/* Hero section */}
      <div className="bg-primary-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Our Services
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-primary-100">
            Professional financial services tailored to your
            needs
          </p>
        </div>
      </div>

      {/* Services grid */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-10 grid gap-8 grid-cols-1 md:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.id}
                className="card transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                      <service.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      {service.name}
                    </h2>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">{service.description}</p>
                <ul className="mt-4 space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-primary-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-sm text-gray-600">{feature}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link
                    href={service.href}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Contact us today for a free consultation and let us help you with
            your financial needs.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
