import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Validation schemas
export const schemas = {
  // User consent validation
  userConsent: Joi.object({
    name: Joi.string().min(2).max(100).required().trim(),
    email: Joi.string().email().required().lowercase().trim(),
    consentOptions: Joi.array().items(
      Joi.object({
        id: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        required: Joi.boolean().required(),
        checked: Joi.boolean().required(),
      })
    ).min(1).required(),
  }),

  // Admin login validation
  adminLogin: Joi.object({
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().min(6).required(),
  }),

  // Consent option validation
  consentOption: Joi.object({
    id: Joi.string().required().trim(),
    title: Joi.string().min(2).max(200).required().trim(),
    description: Joi.string().min(10).max(1000).required().trim(),
    required: Joi.boolean().required(),
    checked: Joi.boolean().required(),
  }),

  // System settings validation
  systemSettings: Joi.object({
    sessionTimeoutMinutes: Joi.number().min(5).max(480).required(),
    enableAuditLogging: Joi.boolean().required(),
    enableNotifications: Joi.boolean().required(),
    dataRetentionDays: Joi.number().min(30).max(3650).required(),
  }),

  // Pagination validation
  pagination: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(20),
    sortBy: Joi.string().valid('createdAt', 'updatedAt', 'email', 'name').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  }),

  // Audit log filters
  auditFilters: Joi.object({
    category: Joi.string().valid('auth', 'consent', 'settings', 'error', 'general').optional(),
    userId: Joi.string().optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
  }),
};

// Validation middleware factory
export const validate = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        message: 'Validation failed',
        errors,
      });
    }

    // Replace the request property with the validated and sanitized value
    req[property] = value;
    next();
  };
};

// Email validation helper
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
export const validatePasswordStrength = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim();
};

// Validate UUID format
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};
