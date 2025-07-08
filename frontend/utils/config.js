/**
 * Application configuration
 * Centralizes environment variables and configuration settings
 */

/**
 * Environment configuration with fallbacks
 */
export const config = {
  // API configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001",
    timeout: 30000, // 30 seconds
  },

  // File upload configuration
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: [".pdf", ".zip", ".docx", ".jpg", ".jpeg"],
    maxFiles: 5,
  },

  // Pagination defaults
  pagination: {
    defaultLimit: 10,
    defaultPage: 1,
  },

  // Feature flags
  features: {
    enableRegistration: process.env.NEXT_PUBLIC_ENABLE_REGISTRATION === "true",
  },
};

/**
 * Get a configuration value with optional default
 * @param {string} path - Dot notation path to the config value
 * @param {any} defaultValue - Default value if path doesn't exist
 * @returns {any} The configuration value or default
 */
export const getConfig = (path, defaultValue = undefined) => {
  const keys = path.split(".");
  let result = config;

  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = result[key];
    } else {
      return defaultValue;
    }
  }

  return result;
};
