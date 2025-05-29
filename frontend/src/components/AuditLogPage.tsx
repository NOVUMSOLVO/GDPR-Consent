import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AuditLog {
  id: string;
  action: string;
  category: string;
  userId: string;
  userName: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  orgId?: string;
  role?: string;
}

interface AuditLogPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface AuditLogResponse {
  data: AuditLog[];
  pagination: AuditLogPagination;
}

const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState<AuditLogPagination>({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    userId: '',
    startDate: '',
    endDate: '',
    sortBy: 'timestamp',
    sortOrder: 'desc' as 'asc' | 'desc'
  });
  const auth = useAuth();

  useEffect(() => {
    fetchAuditLogs();
  }, [pagination.page, filters]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.userId) queryParams.append('userId', filters.userId);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      
      const response = await fetch(`http://localhost:3001/api/admin/audit-logs?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch audit logs');
      }
      
      const data: AuditLogResponse = await response.json();
      setLogs(data.data);
      setPagination(data.pagination);
      
    } catch (err) {
      setError('Failed to load audit logs');
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on filter change
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      userId: '',
      startDate: '',
      endDate: '',
      sortBy: 'timestamp',
      sortOrder: 'desc'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getCategoryClass = (category: string) => {
    switch (category) {
      case 'auth':
        return 'category-auth';
      case 'consent':
        return 'category-consent';
      case 'settings':
        return 'category-settings';
      case 'error':
        return 'category-error';
      default:
        return 'category-general';
    }
  };

  return (
    <div>
      <h2>Audit Logs</h2>
      <p>Track all administrative actions and system events.</p>
      
      {error && (
        <div className="error-message" style={{ marginBottom: '15px' }}>
          {error}
          <button 
            onClick={fetchAuditLogs} 
            style={{ marginLeft: '10px' }}
            className="button button-secondary"
          >
            Retry
          </button>
        </div>
      )}
      
      <div className="filter-controls">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select 
              id="category" 
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="auth">Authentication</option>
              <option value="consent">Consent Management</option>
              <option value="settings">Settings</option>
              <option value="error">Errors</option>
              <option value="general">General</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="sortBy">Sort By</label>
            <select 
              id="sortBy" 
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
            >
              <option value="timestamp">Timestamp</option>
              <option value="action">Action</option>
              <option value="userId">User ID</option>
              <option value="category">Category</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="sortOrder">Order</label>
            <select 
              id="sortOrder" 
              name="sortOrder"
              value={filters.sortOrder}
              onChange={handleFilterChange}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
        
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="startDate">From Date</label>
            <input 
              type="date" 
              id="startDate" 
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="endDate">To Date</label>
            <input 
              type="date" 
              id="endDate" 
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="userId">User ID</label>
            <input 
              type="text" 
              id="userId" 
              name="userId"
              value={filters.userId}
              onChange={handleFilterChange}
              placeholder="Filter by user ID"
            />
          </div>
          
          <button 
            className="button button-secondary"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>
      
      {loading && logs.length === 0 ? (
        <div className="loading">Loading audit logs...</div>
      ) : (
        <div className="audit-log-container">
          {logs.length === 0 ? (
            <div className="no-logs-message">
              No audit logs found matching your criteria.
            </div>
          ) : (
            <>
              {logs.map(log => (
                <div key={log.id} className={`audit-log-entry ${getCategoryClass(log.category)}`}>
                  <div className="audit-log-timestamp">{formatDate(log.timestamp)}</div>
                  <div className="audit-log-header">
                    <span className="audit-log-user">{log.userName}</span>
                    <span className="audit-log-category">{log.category}</span>
                  </div>
                  <p className="audit-log-message">{log.action}</p>
                  <div className="audit-log-details">
                    <span>IP: {log.ipAddress || 'Unknown'}</span>
                    {log.role && <span>Role: {log.role}</span>}
                  </div>
                </div>
              ))}
              
              {pagination.pages > 1 && (
                <div className="pagination">
                  <button
                    disabled={pagination.page === 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={pagination.page === page ? 'active' : ''}
                      onClick={() => setPagination(prev => ({ ...prev, page }))}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    disabled={pagination.page === pagination.pages}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AuditLogPage;