/**
 * File handling utilities
 * Provides consistent file path and URL handling
 */

/**
 * Generates a proper URL for file downloads
 * Now uses document ID for retrieving files from database
 * @param {string} documentId - The document ID from the database
 * @returns {string} Properly formatted URL for the file
 */
export const getFileUrl = (documentId) => {
  if (!documentId) return "";

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  return `${apiUrl}/api/forms/download/${documentId}`;
};

/**
 * Downloads a document with proper authentication
 * @param {string} documentId - The document ID to download
 * @param {string} fileName - Optional filename for the download
 */
export const downloadDocumentWithAuth = async (documentId, fileName) => {
  if (!documentId) return;
  
  try {
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.error("Authentication token not found");
      return;
    }
    
    // Create a fetch request with the authorization header
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forms/download/${documentId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }
    
    // Get the blob from the response
    const blob = await response.blob();
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || `document-${documentId}`;
    
    // Append to the document, click it, and clean up
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading document:", error);
  }
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
