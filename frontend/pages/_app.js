import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import { useEffect } from "react";
import { setAuthToken } from "../utils/auth";
import { httpClient } from "../utils/httpClient";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Check for token and set auth header
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
      }
    }

    // Log the base URL for debugging
    console.log("API Base URL:", process.env.NEXT_PUBLIC_API_URL);
  }, []);

  return (
    <>
      <Head>
        <title>Com Financial Services - Professional Financial Solutions</title>
        <meta
          name="description"
          content="Professional financial services including tax filing, GST registration, company incorporation, and financial auditing."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" type="image/png" />
      </Head>

      <Toaster position="top-right" />

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
