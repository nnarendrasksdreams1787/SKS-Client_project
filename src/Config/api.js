// Central API configuration

// const API_BASE_URL = (
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"
// ).replace(/\/$/, "");

// export const ADMIN_API_URL = `${API_BASE_URL}/api/admin`;
// export const AUTH_API_URL = `${API_BASE_URL}/api/auth`;


// src/Config/api.js

// export const API_BASE_URL = (
//   import.meta.env.VITE_API_BASE_URL ||
//   "http://localhost:4000"
// ).replace(/\/+$/, "");

// export const ADMIN_API_URL = `${API_BASE_URL}/api/admin`;
// export const AUTH_API_URL = `${API_BASE_URL}/api/auth`;
// export const USER_API_URL = `${API_BASE_URL}/api/user`;


const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://sks-serverproject-new.onrender.com"
).replace(/\/+$/, "");

export { API_BASE_URL };

export const ADMIN_API_URL = `${API_BASE_URL}/api/admin`;
export const AUTH_API_URL = `${API_BASE_URL}/api/auth`;
export const USER_API_URL = `${API_BASE_URL}/api/user`;
