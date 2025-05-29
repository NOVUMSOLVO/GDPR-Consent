/**
 * Application configuration
 */

// JWT configuration
export const JWT_CONFIG = {
  SECRET: (process.env.JWT_SECRET || 'gdpr-consent-secret-key') as string,
  EXPIRY: (process.env.JWT_EXPIRY || '30m') as string, // 30 minutes
};

// Server configuration
export const SERVER_CONFIG = {
  PORT_START: parseInt(process.env.PORT_START || '3001', 10),
  PORT_MAX: parseInt(process.env.PORT_MAX || '3020', 10),
};

// Data storage configuration
export const STORAGE_CONFIG = {
  DATA_DIR: process.env.DATA_DIR || './data',
};
