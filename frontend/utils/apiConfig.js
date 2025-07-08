/**
 * Centralized API endpoint configuration
 * This file provides a single source of truth for all API endpoints
 * to prevent mismatches between frontend and backend
 */

const API_PATHS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    ME: "/api/auth/me",
    PROFILE: "/api/auth/profile",
    PASSWORD: "/api/auth/password",
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
  },
};

export default API_PATHS;
