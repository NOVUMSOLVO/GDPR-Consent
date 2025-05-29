import { apiClient } from './apiClient';
import { AdminLoginCredentials, AdminLoginResponse, UserConsent } from '../types';
import { AUTH_CONFIG } from '../config';

export interface PaginationParams {
  page: number;
  limit: number;
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

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  category: string;
  action: string;
  userId: string;
  userName: string;
  ipAddress: string;
  details?: Record<string, any>;
}

export interface ConsentStatistics {
  total: number;
  active: number;
  revoked: number;
  expired: number;
  byPurpose: Record<string, number>;
}

/**
 * Admin login
 */
export const adminLogin = async (credentials: AdminLoginCredentials): Promise<AdminLoginResponse> => {
  try {
    console.log('Sending login request to:', '/admin/login');
    return await apiClient.post('/admin/login', credentials);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Validate admin token
 */
export const validateToken = async (): Promise<{ valid: boolean; user: any }> => {
  try {
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    if (!token) {
      throw new Error('No token found');
    }

    return await apiClient.post('/admin/validate-token', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Token validation error:', error);
    throw error;
  }
};

/**
 * Get all consent records with pagination and filtering
 */
export const getAllConsents = async (
  page = 1,
  limit = 10,
  search = '',
  sortBy = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<PaginatedResponse<UserConsent>> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
    });

    if (search) {
      queryParams.append('search', search);
    }

    return await apiClient.authRequest(`/admin/consents?${queryParams.toString()}`);
  } catch (error) {
    console.error('Error fetching consents:', error);
    throw error;
  }
};

/**
 * Delete a consent record
 */
export const deleteConsent = async (id: string): Promise<void> => {
  try {
    await apiClient.authRequest(`/admin/consents/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Error deleting consent:', error);
    throw error;
  }
};

/**
 * Bulk delete consent records
 */
export const bulkDeleteConsents = async (ids: string[]): Promise<void> => {
  try {
    await apiClient.authRequest('/admin/consents/bulk-delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ids })
    });
  } catch (error) {
    console.error('Error bulk deleting consents:', error);
    throw error;
  }
};

/**
 * Get audit logs with pagination, filtering, and sorting
 */
export const getAuditLogs = async (
  page = 1,
  limit = 20,
  filters: Record<string, string> = {},
  sortBy = 'timestamp',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<PaginatedResponse<AuditLogEntry>> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
      ...filters,
    });

    return await apiClient.authRequest(`/admin/audit-logs?${queryParams.toString()}`);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
};

/**
 * Get statistics about consent records
 */
export const getConsentStatistics = async (): Promise<ConsentStatistics> => {
  try {
    return await apiClient.authRequest('/admin/statistics/consent');
  } catch (error) {
    console.error('Error fetching consent statistics:', error);
    throw error;
  }
};

/**
 * Export audit logs as CSV
 */
export const exportAuditLogs = async (filters: Record<string, string> = {}): Promise<Blob> => {
  try {
    const queryParams = new URLSearchParams({
      ...filters,
      format: 'csv',
    });

    const response = await apiClient.authRequest(`/admin/audit-logs/export?${queryParams.toString()}`);
    return new Blob([response], { type: 'text/csv' });
  } catch (error) {
    console.error('Error exporting audit logs:', error);
    throw error;
  }
};