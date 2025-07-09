/**
 * HTTP client for making API requests
 * Provides a consistent interface for API calls with error handling
 */

import axios from "axios";
import { getConfig } from "./config";
import { handleApiError } from "./errorHandler";
import API_PATHS from "./apiConfig";

// Create axios instance with default config
const httpClient = axios.create({
  baseURL: getConfig("api.baseUrl"),
  timeout: getConfig("api.timeout"),
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
httpClient.interceptors.request.use(
  (config) => {
    // Add token to request if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Log request details
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data,
      params: config.params,
    });

    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
httpClient.interceptors.response.use(
  (response) => {
    // Log response details
    console.log(`API Response: ${response.status} ${response.config.url}`, {
      data: response.data,
      headers: response.headers,
    });

    return response;
  },
  (error) => {
    // Log error details
    console.error(`API Response Error: ${error.config?.url}`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      // Clear auth data and redirect to login if not already there
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

/**
 * API request wrapper with error handling
 * @param {Function} apiCall - Axios request function to execute
 * @param {string} errorMessage - Default error message
 * @returns {Promise} - Promise resolving to the API response data
 */
export const apiRequest = async (
  apiCall,
  errorMessage = "An error occurred"
) => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    const message = handleApiError(error, errorMessage);
    throw new Error(message);
  }
};

// Export the client and API paths
export { httpClient, API_PATHS };

// Export convenience methods
export default {
  get: (url, config) => httpClient.get(url, config),
  post: (url, data, config) => httpClient.post(url, data, config),
  put: (url, data, config) => httpClient.put(url, data, config),
  delete: (url, config) => httpClient.delete(url, config),
  apiRequest,
};
