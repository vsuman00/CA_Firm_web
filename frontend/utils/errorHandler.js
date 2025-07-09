/**
 * Error handling utilities
 * Provides consistent error handling patterns across the application
 */

import toast from "react-hot-toast";

/**
 * Handles API errors consistently
 * @param {Error} error - The error object from the API call
 * @param {string} defaultMessage - Default message to show if no specific error message is available
 * @returns {string} The error message to display
 */
export const handleApiError = (error, defaultMessage = "An error occurred") => {
  // Log detailed error information
  console.error(`API Error Details:`, {
    message: error.message,
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: error.response?.data,
    url: error.config?.url,
    method: error.config?.method,
    headers: error.config?.headers,
  });

  // Extract the most useful error message
  let message = defaultMessage;
  
  // First check for error codes, then fall back to message mapping
  if (error.response?.data?.code) {
    const errorCode = error.response.data.code;
    
    // Map of error codes to user-friendly messages
    const errorCodeMap = {
      "INVALID_LOGIN": "The email or password you entered is incorrect. Please try again.",
      "INVALID_PASSWORD": "The password you entered is incorrect. Please try again.",
      "EMAIL_IN_USE": "An account with this email already exists. Please use a different email or sign in.",
      "INVALID_OTP": "The verification code you entered is invalid or has expired. Please try again.",
      "SERVER_ERROR": "We're experiencing technical difficulties. Please try again later."
    };
    
    message = errorCodeMap[errorCode] || error.response.data.message;
  }
  // If no error code, map common error messages to user-friendly versions
  else if (error.response?.data?.message) {
    const serverMessage = error.response.data.message;
    
    // Map of server error messages to user-friendly messages
    const errorMessageMap = {
      "Invalid credentials": "The email or password you entered is incorrect. Please try again.",
      "User already exists": "An account with this email already exists. Please use a different email or sign in.",
      "Server error": "We're experiencing technical difficulties. Please try again later.",
      "Email already in use": "This email is already registered. Please use a different email or sign in."
    };
    
    message = errorMessageMap[serverMessage] || serverMessage;
  } else if (error.response?.data?.error) {
    message = error.response.data.error;
  } else if (error.message && !error.message.includes("Network Error")) {
    message = error.message;
  } else if (error.message && error.message.includes("Network Error")) {
    message = "Unable to connect to the server. Please check your internet connection and try again.";
  }

  return message;
};

/**
 * Shows an error toast and sets error state
 * @param {Error} error - The error object from the API call
 * @param {string} defaultMessage - Default message to show if no specific error message is available
 * @param {Function} setError - State setter function for error state
 */
export const handleApiErrorWithToast = (
  error,
  defaultMessage,
  setError = null
) => {
  const errorMessage = handleApiError(error, defaultMessage);
  toast.error(errorMessage);
  if (setError) {
    setError(errorMessage);
  }
};
