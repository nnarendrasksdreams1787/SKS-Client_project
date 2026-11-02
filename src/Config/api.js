// Central API configuration

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"
).replace(/\/$/, "");

export const ADMIN_API_URL = `${API_BASE_URL}/api/admin`;
export const AUTH_API_URL = `${API_BASE_URL}/api/auth`;