import Link from "next/link";
import Layout from "../components/Layout";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

// Testimonial data
const testimonials = [
  {
    id: 1,
    content:
      "Com Financial Services helped me navigate complex tax regulations and saved me a significant amount on my returns. Highly recommended!",
    author: "Rahul Sharma",
    role: "Small Business Owner",
  },
  {
    id: 2,
    content:
      "The team at Com Financial Services made my company incorporation process smooth and hassle-free. Their expertise is unmatched.",
    author: "Priya Patel",
    role: "Startup Founder",
  },
  {
    id: 3,
    content:
      "I've been using their services for GST filing for years. They are prompt, professional, and always available for queries.",
    author: "Vikram Singh",
    role: "Retail Business Owner",
  },
];

// Services list
const services = [
  "Personal and business tax filing",
  "GST registration and compliance",
  "Company incorporation and registration",
  "Financial auditing and reporting",
  "Bookkeeping and financial management",
  "Business advisory and consulting",
];

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}

      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <main className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
              <div className="sm:text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block xl:inline">Professional</span>{" "}
                    <motion.span
                      className="block text-primary-600 xl:inline"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                    >
                      Financial Services
                    </motion.span>
                  </h1>
                </motion.div>
                <motion.p
                  className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  We provide comprehensive financial, tax, and advisory
                  services to individuals and businesses of all sizes.
                </motion.p>
                <motion.div
                  className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <div className="rounded-md shadow">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/services"
                        className="btn btn-primary shadow-sm hover:shadow-md transition-all duration-200 w-full flex items-center justify-center px-8 py-3 md:py-4 md:text-lg md:px-10"
                      >
                        Our Services
                      </Link>
                    </motion.div>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/contact"
                        className="btn btn-outline shadow-sm hover:shadow-md transition-all duration-200 w-full flex items-center justify-center px-8 py-3 md:py-4 md:text-lg md:px-10"
                      >
                        Contact Us
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <motion.div
            className="h-56 w-full bg-primary-100 sm:h-72 md:h-96 lg:w-full lg:h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {/* Modern financial hero image */}
            <div className="w-full h-full flex items-center justify-center">
              <motion.img
                src="/hero-image.svg"
                alt="Financial services illustration"
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Services Overview */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="lg:text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
              Services
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Comprehensive Financial Solutions
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We offer a wide range of financial services
              tailored to meet your specific needs.
            </p>
          </motion.div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <dt>
                    <motion.div
                      className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white shadow-md"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <CheckCircleIcon className="h-6 w-6" aria-hidden="true" />
                    </motion.div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                      {service}
                    </p>
                  </dt>
                </motion.div>
              ))}
            </dl>
          </div>

          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/services"
                className="btn btn-primary shadow-sm hover:shadow-md transition-all duration-200 inline-flex items-center px-6 py-3"
              >
                View All Services
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What Our Clients Say
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Don't just take our word for it — hear from some of our satisfied
              clients.
            </p>
          </motion.div>
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  className="bg-white rounded-xl shadow-card hover:shadow-card-hover p-6 flex flex-col transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex-1">
                    <p className="text-gray-600 italic">
                      {testimonial.content}
                    </p>
                  </div>
                  <motion.div
                    className="mt-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.2, duration: 0.5 }}
                  >
                    <p className="font-medium text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-primary-600">
                      {testimonial.role}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-10 lg:mb-0"
            >
              <div className="bg-primary-100 rounded-3xl p-8 h-full flex items-center justify-center">
                <motion.div
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 10,
                    ease: "easeInOut",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-48 w-48 text-primary-500 opacity-80"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-4">
                Why Choose <span className="text-primary-600">US</span>
              </h2>
              <p className="text-lg text-gray-500 mb-6 leading-relaxed">
                With over 15 years of experience, our team of certified
                financial advisors provides personalized financial solutions that help
                you achieve your goals.
              </p>

              <div className="space-y-4">
                {[
                  "Expert team of certified professionals",
                  "Personalized approach to every client",
                  "Timely delivery and responsive communication",
                  "Up-to-date with latest tax laws and regulations",
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  >
                    <div className="flex-shrink-0">
                      <CheckCircleIcon
                        className="h-6 w-6 text-accent-500"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="ml-3 text-base text-gray-700">{item}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/contact"
                    className="btn btn-accent shadow-sm hover:shadow-md transition-all duration-200 inline-flex items-center px-6 py-3"
                  >
                    Schedule a Consultation
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
