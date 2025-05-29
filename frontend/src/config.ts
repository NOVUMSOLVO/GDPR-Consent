/**
 * Application configuration
 */

// API configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3004/api',
  TIMEOUT: 10000, // 10 seconds
};

// Auth configuration
export const AUTH_CONFIG = {
  TOKEN_KEY: 'adminToken',
  SESSION_TIMEOUT_MINUTES: 30,
};

// Feature flags
export const FEATURES = {
  ENABLE_AUDIT_LOGGING: true,
  ENABLE_EXPORT: true,
};
