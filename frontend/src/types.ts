// Defines a consent option
export interface ConsentOption {
  id: string;
  title: string;
  description: string;
  required: boolean;
  checked: boolean;
}

// Defines a user consent record
export interface UserConsent {
  id?: string; // Optional, may be assigned by the backend
  name: string;
  email: string;
  consentOptions: ConsentOption[];
  createdAt?: string; // Optional, may be assigned by the backend
  updatedAt?: string; // Optional, may be assigned by the backend
}

// Validation error interface
export interface ValidationError {
  field: string;
  message: string;
}

// Available languages for the application
export type Language = 'en' | 'fr' | 'de' | 'es';

// Language strings dictionary
export interface LanguageStrings {
  [key: string]: string;
}

// Admin types
export interface AdminLoginCredentials {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    organizationId: string;
    organizationName: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ConsentStats {
  totalConsents: number;
  recentConsents: number;
  consentRates: {
    id: string;
    total: number;
    accepted: number;
    rate: number;
  }[];
}