/**
 * Centralized API endpoint configuration
 * This file provides a single source of truth for all API endpoints
 * to prevent mismatches between frontend and backend
 */

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    ME: "/api/auth/me",
    PROFILE: "/api/auth/profile",
    PASSWORD: "/api/auth/password",
    REQUEST_OTP: "/api/auth/request-otp",
    VERIFY_OTP: "/api/auth/verify-otp",
    TOGGLE_OTP: "/api/auth/toggle-otp",
  },
  ADMIN: {
    FORMS: "/api/admin/forms",
    FORM_DETAIL: (id) => `/api/admin/forms/${id}`,
    FORM_STATUS: (id) => `/api/admin/forms/${id}/status`,
    CONTACTS: "/api/admin/contacts",
    STATS: "/api/admin/stats",
  },
  FORMS: {
    TAX: "/api/forms/tax",
    CONTACT: "/api/forms/contact",
    USER_SUBMISSIONS: "/api/forms/user-submissions",
    USER_SUBMISSION_DETAIL: (id) => `/api/forms/user-submissions/${id}`,
  },
};

export default API_PATHS;
