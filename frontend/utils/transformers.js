/**
 * Data transformation utilities
 * Handles transformations between backend and frontend data structures
 */

/**
 * Transforms tax form data from API response to frontend format
 * @param {Object} apiResponse - The raw API response
 * @returns {Object} Transformed data for frontend use
 */
export const transformTaxFormResponse = (apiResponse) => {
  if (!apiResponse) return null;

  return {
    ...apiResponse,
    // Ensure documents paths are correctly formatted
    documents:
      apiResponse.documents?.map((doc) => ({
        ...doc,
        path: doc.path?.startsWith("/") ? doc.path.substring(1) : doc.path,
      })) || [],
  };
};

/**
 * Transforms dashboard stats from API response to frontend format
 * @param {Object} apiResponse - The raw API response
 * @returns {Object} Transformed stats for dashboard display
 */
export const transformDashboardStats = (apiResponse) => {
  if (!apiResponse) return {};

  return {
    taxFormsPending: apiResponse.taxForms?.pending || 0,
    taxFormsReviewed: apiResponse.taxForms?.reviewed || 0,
    taxFormsFiled: apiResponse.taxForms?.filed || 0,
    contactMessages: apiResponse.contacts || 0,
    recentForms: apiResponse.recent || [],
  };
};

/**
 * Transforms pagination data from API response
 * @param {Object} apiResponse - The raw API response with pagination
 * @returns {Object} Standardized pagination object
 */
export const transformPagination = (apiResponse) => {
  if (!apiResponse?.pagination) return { currentPage: 1, totalPages: 1 };

  return {
    currentPage: apiResponse.pagination.page || 1,
    totalPages: apiResponse.pagination.pages || 1,
    totalItems: apiResponse.pagination.total || 0,
    limit: apiResponse.pagination.limit || 10,
  };
};
