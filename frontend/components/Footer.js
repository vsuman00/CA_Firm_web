import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="xl:grid xl:grid-cols-3 xl:gap-8"
        >
          <div className="space-y-8 xl:col-span-1">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link
                href="/"
                className="hover:opacity-90 transition-opacity duration-200"
              >
                <img
                  src="/logo1.png"
                  alt="Com Financial Services"
                  className="h-30 w-auto"
                />
              </Link>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-gray-500 text-sm mt-2"
            >
              Professional financial services for individuals and businesses.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex space-x-6"
            >
              <motion.a
                href="#"
                className="text-gray-400 hover:text-primary-500 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-primary-500 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-primary-500 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.a>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0"
          >
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-sm font-semibold text-gray-900 border-b border-primary-200 pb-2"
                >
                  Services
                </motion.h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <Link
                        href="/services"
                        className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
                      >
                        Tax Filing
                      </Link>
                    </motion.div>
                  </li>
                  <li>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <Link
                        href="/services"
                        className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
                      >
                        GST Registration
                      </Link>
                    </motion.div>
                  </li>
                  <li>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      <Link
                        href="/services"
                        className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
                      >
                        Company Incorporation
                      </Link>
                    </motion.div>
                  </li>
                  <li>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      <Link
                        href="/services"
                        className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
                      >
                        Financial Auditing
                      </Link>
                    </motion.div>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-sm font-semibold text-gray-900 border-b border-primary-200 pb-2"
                >
                  Company
                </motion.h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <Link
                        href="/"
                        className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
                      >
                        About
                      </Link>
                    </motion.div>
                  </li>
                  <li>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <Link
                        href="/contact"
                        className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
                      >
                        Contact
                      </Link>
                    </motion.div>
                  </li>
                  <li>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      <a
                        href="#"
                        className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
                      >
                        Privacy Policy
                      </a>
                    </motion.div>
                  </li>
                  <li>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      <a
                        href="#"
                        className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
                      >
                        Terms of Service
                      </a>
                    </motion.div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-sm font-semibold text-gray-900 border-b border-primary-200 pb-2"
                >
                  Contact
                </motion.h3>
                <ul role="list" className="mt-4 space-y-4">
                  <motion.li
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-sm text-gray-500"
                  >
                    211, NARAYAN PLAZA
                    <br />
                    EXHIBITION ROAD
                    <br />
                    PATNA, BIHAR-800001
                  </motion.li>
                  <li>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <a
                        href="tel:+91 9525239747"
                        className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
                      >
                        +91 95252 39747
                      </a>
                    </motion.div>
                  </li>
                  <li>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      <a
                        href="mailto:krishoberoi1@gmail.com"
                        className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
                      >
                        krishoberoi1@gmail.com
                      </a>
                    </motion.div>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-sm font-semibold text-gray-900 border-b border-primary-200 pb-2"
                >
                  Hours
                </motion.h3>
                <ul role="list" className="mt-4 space-y-4">
                  <motion.li
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-sm text-gray-500"
                  >
                    <span className="font-medium">Monday-Saturday:</span>
                    <br />
                    10:00 AM - 7:00 PM
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-sm text-gray-500"
                  ></motion.li>
                  <motion.li
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="text-sm text-gray-500"
                  >
                    <span className="font-medium">Sunday:</span>
                    <br />
                    Closed
                  </motion.li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-12 border-t border-gray-200 pt-8"
        >
          <p className="text-sm text-gray-400 text-center">
            &copy; {currentYear} Com Financial Services. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 text-center">
            Create by
            <a
              href="https://www.linkedin.com/in/vaibhav-suman/"
              target="_blank"
              className="px-1 text-gray-800 hover:underline"
            >
              Vaibhav Suman
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
