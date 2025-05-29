import { useForm, UseFormReturn, FieldValues, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Validation schemas
export const consentFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  consentOptions: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    required: z.boolean(),
    checked: z.boolean(),
  })).min(1, 'At least one consent option is required'),
});

export const adminLoginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
});

export const consentOptionSchema = z.object({
  id: z.string()
    .min(1, 'ID is required')
    .regex(/^[a-zA-Z0-9_-]+$/, 'ID can only contain letters, numbers, hyphens, and underscores'),
  title: z.string()
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must be less than 200 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  required: z.boolean(),
  checked: z.boolean(),
});

export const systemSettingsSchema = z.object({
  sessionTimeoutMinutes: z.number()
    .min(5, 'Session timeout must be at least 5 minutes')
    .max(480, 'Session timeout must be less than 8 hours'),
  enableAuditLogging: z.boolean(),
  enableNotifications: z.boolean(),
  dataRetentionDays: z.number()
    .min(30, 'Data retention must be at least 30 days')
    .max(3650, 'Data retention must be less than 10 years'),
});

// Type inference from schemas
export type ConsentFormData = z.infer<typeof consentFormSchema>;
export type AdminLoginData = z.infer<typeof adminLoginSchema>;
export type ConsentOptionData = z.infer<typeof consentOptionSchema>;
export type SystemSettingsData = z.infer<typeof systemSettingsSchema>;

// Generic form validation hook
export function useFormValidation<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  defaultValues?: DefaultValues<T>
): UseFormReturn<T> & {
  isValid: boolean;
  isDirty: boolean;
  errors: Record<string, string>;
} {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const { formState } = form;
  
  // Convert react-hook-form errors to simple string map
  const errors = Object.keys(formState.errors).reduce((acc, key) => {
    const error = formState.errors[key];
    acc[key] = error?.message as string || 'Invalid value';
    return acc;
  }, {} as Record<string, string>);

  return {
    ...form,
    isValid: formState.isValid,
    isDirty: formState.isDirty,
    errors,
  };
}

// Specific form hooks
export const useConsentForm = (defaultValues?: Partial<ConsentFormData>) => {
  return useFormValidation(consentFormSchema, defaultValues);
};

export const useAdminLoginForm = (defaultValues?: Partial<AdminLoginData>) => {
  return useFormValidation(adminLoginSchema, defaultValues);
};

export const useConsentOptionForm = (defaultValues?: Partial<ConsentOptionData>) => {
  return useFormValidation(consentOptionSchema, defaultValues);
};

export const useSystemSettingsForm = (defaultValues?: Partial<SystemSettingsData>) => {
  return useFormValidation(systemSettingsSchema, defaultValues);
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
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

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim();
};

// Custom validation rules
export const customValidationRules = {
  name: {
    required: 'Name is required',
    minLength: { value: 2, message: 'Name must be at least 2 characters' },
    maxLength: { value: 100, message: 'Name must be less than 100 characters' },
    pattern: {
      value: /^[a-zA-Z\s'-]+$/,
      message: 'Name can only contain letters, spaces, hyphens, and apostrophes'
    }
  },
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    }
  },
  password: {
    required: 'Password is required',
    minLength: { value: 6, message: 'Password must be at least 6 characters' }
  },
  consentOptionId: {
    required: 'ID is required',
    pattern: {
      value: /^[a-zA-Z0-9_-]+$/,
      message: 'ID can only contain letters, numbers, hyphens, and underscores'
    }
  }
};
