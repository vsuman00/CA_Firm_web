/**
 * File handling utilities
 * Provides consistent file path and URL handling
 */

/**
 * Generates a proper URL for file downloads
 * Prevents double slash issues by cleaning the path
 * @param {string} path - The file path from the API
 * @returns {string} Properly formatted URL for the file
 */
export const getFileUrl = (path) => {
  if (!path) return "";

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // Remove leading slash to prevent double slash issues
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  return `${apiUrl}/${cleanPath}`;
};

/**
 * Formats file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Gets file extension from filename
 * @param {string} filename - The filename
 * @returns {string} The file extension (lowercase, without dot)
 */
export const getFileExtension = (filename) => {
  if (!filename) return "";
  return filename.split(".").pop().toLowerCase();
};

/**
 * Checks if a file is of a specific type based on extension
 * @param {string} filename - The filename to check
 * @param {Array<string>} allowedExtensions - Array of allowed extensions
 * @returns {boolean} Whether the file has an allowed extension
 */
export const isAllowedFileType = (filename, allowedExtensions) => {
  if (!filename || !allowedExtensions || !allowedExtensions.length)
    return false;

  const extension = getFileExtension(filename);
  return allowedExtensions.includes(extension);
};
