import React from "react";

/**
 * Loading spinner component with configurable size
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the spinner (sm, md, lg)
 * @param {string} props.className - Additional CSS classes
 */
export const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-b-2 border-primary-500 ${sizeClasses[size]}`}
      ></div>
    </div>
  );
};

/**
 * Full page loading state
 * @param {Object} props - Component props
 * @param {string} props.message - Optional loading message
 */
export const FullPageLoading = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 z-50">
      <LoadingSpinner size="lg" />
      {message && <p className="mt-4 text-gray-600 text-lg">{message}</p>}
    </div>
  );
};

/**
 * Section loading state for contained areas
 * @param {Object} props - Component props
 * @param {string} props.message - Optional loading message
 * @param {string} props.height - Height of the container
 */
export const SectionLoading = ({ message = "Loading...", height = "h-64" }) => {
  return (
    <div
      className={`w-full ${height} flex flex-col items-center justify-center`}
    >
      <LoadingSpinner />
      {message && <p className="mt-2 text-gray-500 text-sm">{message}</p>}
    </div>
  );
};

/**
 * Button loading state
 * @param {Object} props - Component props
 * @param {boolean} props.loading - Whether the button is in loading state
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.rest - Other button props
 */
export const LoadingButton = ({
  loading,
  isLoading, // Support both loading and isLoading props for backward compatibility
  loadingText, // Not used, but captured to prevent passing to DOM
  children,
  className = "",
  ...rest
}) => {
  // Support both loading and isLoading props
  const isButtonLoading = loading || isLoading;

  return (
    <button
      className={`relative ${className}`}
      disabled={isButtonLoading}
      {...rest} // Rest will not include isLoading or loadingText
    >
      {isButtonLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" />
        </span>
      )}
      <span className={isButtonLoading ? "invisible" : ""}>{children}</span>
    </button>
  );
};

// Export individual components
export default {
  LoadingSpinner,
  FullPageLoading,
  SectionLoading,
  LoadingButton,
};
