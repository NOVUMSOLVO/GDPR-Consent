import { ValidationError } from '../types';

/**
 * Validates an email address
 */
export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

/**
 * Validates a name
 */
export const validateName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Name is required';
  }
  
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }
  
  return null;
};

/**
 * Validates the entire form and returns an array of validation errors
 */
export const validateForm = (name: string, email: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  const nameError = validateName(name);
  if (nameError) {
    errors.push({ field: 'name', message: nameError });
  }
  
  const emailError = validateEmail(email);
  if (emailError) {
    errors.push({ field: 'email', message: emailError });
  }
  
  return errors;
};