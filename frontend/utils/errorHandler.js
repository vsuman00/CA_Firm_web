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
  const message = error.response?.data?.message || defaultMessage;
  console.error(`API Error: ${message}`, error);
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
