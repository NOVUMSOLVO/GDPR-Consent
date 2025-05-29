import React, { useState, useEffect } from 'react';
import { getAllConsents, deleteConsent, bulkDeleteConsents } from '../services/admin.api';
import { UserConsent, PaginatedResponse } from '../types';

// Export utility functions
const generateCSV = (consents: UserConsent[]): void => {
  // Define headers
  const headers = ['ID', 'Name', 'Email', 'Created At', 'Updated At', 'Consent Options'];
  
  // Convert consents to CSV rows
  const rows = consents.map(consent => [
    consent.id,
    consent.name,
    consent.email,
    consent.createdAt,
    consent.updatedAt,
    consent.consentOptions.map(option => 
      `${option.id}:${option.checked ? 'Yes' : 'No'}`
    ).join(';')
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Create and download CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `consent-records-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const generatePDF = async (consents: UserConsent[]): Promise<void> => {
  // Dynamically import jspdf and jspdf-autotable
  const { jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');
  
  // Create PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text('GDPR Consent Records', 14, 15);
  
  // Add export date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
  
  // Define table headers
  const headers = [['Name', 'Email', 'Created', 'Consent Status']];
  
  // Define table rows
  const rows = consents.map(consent => [
    consent.name,
    consent.email,
    new Date(consent.createdAt || Date.now()).toLocaleDateString(),
    `${consent.consentOptions.filter(o => o.checked).length}/${consent.consentOptions.length} accepted`
  ]);
  
  // Generate table
  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 30,
    headStyles: {
      fillColor: [52, 152, 219],
      textColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    }
  });
  
  // Save PDF
  doc.save(`consent-records-${new Date().toISOString().split('T')[0]}.pdf`);
};

const ConsentsList: React.FC = () => {
  const [consents, setConsents] = useState<UserConsent[]>([]);
  const [allConsents, setAllConsents] = useState<UserConsent[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);

  useEffect(() => {
    fetchConsents();
  }, [pagination.page, searchTerm, sortBy, sortOrder]);

  const fetchConsents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllConsents(
        pagination.page,
        pagination.limit,
        searchTerm,
        sortBy,
        sortOrder
      );
      
      setConsents(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError('Failed to load consent records');
      console.error('Error fetching consents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this consent record?')) {
      return;
    }
    
    try {
      await deleteConsent(id);
      // Refresh the list
      fetchConsents();
    } catch (err) {
      setError('Failed to delete consent record');
      console.error('Error deleting consent:', err);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} consent records?`)) {
      return;
    }
    
    try {
      await bulkDeleteConsents(selectedIds);
      setSelectedIds([]);
      // Refresh the list
      fetchConsents();
    } catch (err) {
      setError('Failed to delete consent records');
      console.error('Error bulk deleting consents:', err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset to first page when searching
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      // Toggle sort order if clicking on the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending when changing sort field
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(consents.map(c => c.id!));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && consents.length === 0) {
    return <div className="loading">Loading consent records...</div>;
  }

  const handleExportCSV = async () => {
    try {
      setExportLoading(true);
      
      // If no consents are loaded or all consents are needed, fetch all
      if (allConsents.length === 0) {
        const response = await getAllConsents(1, 1000, searchTerm, sortBy, sortOrder);
        setAllConsents(response.data);
        generateCSV(response.data);
      } else {
        generateCSV(allConsents);
      }
      
    } catch (err) {
      setError('Failed to export data to CSV');
      console.error('Error exporting to CSV:', err);
    } finally {
      setExportLoading(false);
    }
  };
  
  const handleExportPDF = async () => {
    try {
      setExportLoading(true);
      
      // If no consents are loaded or all consents are needed, fetch all
      if (allConsents.length === 0) {
        const response = await getAllConsents(1, 1000, searchTerm, sortBy, sortOrder);
        setAllConsents(response.data);
        await generatePDF(response.data);
      } else {
        await generatePDF(allConsents);
      }
      
    } catch (err) {
      setError('Failed to export data to PDF');
      console.error('Error exporting to PDF:', err);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div>
      <h2>Consent Records</h2>
      <p>Manage all user consent preferences.</p>
      
      {error && (
        <div className="error-message" style={{ marginBottom: '15px' }}>
          {error}
          <button 
            onClick={fetchConsents} 
            style={{ marginLeft: '10px' }}
            className="button button-secondary"
          >
            Retry
          </button>
        </div>
      )}
      
      <div className="export-options">
        <button 
          className="button button-secondary"
          onClick={handleExportCSV}
          disabled={exportLoading || consents.length === 0}
        >
          {exportLoading ? 'Exporting...' : 'Export CSV'}
        </button>
        <button 
          className="button button-secondary"
          onClick={handleExportPDF}
          disabled={exportLoading || consents.length === 0}
        >
          {exportLoading ? 'Exporting...' : 'Export PDF'}
        </button>
      </div>
      
      <div className="consents-table-container">
        <div className="table-controls">
          <form className="search-box" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </form>
          
          <div className="bulk-actions">
            {selectedIds.length > 0 && (
              <button 
                onClick={handleBulkDelete}
                className="button button-secondary"
                style={{ color: '#e74c3c', borderColor: '#e74c3c' }}
              >
                Delete Selected ({selectedIds.length})
              </button>
            )}
          </div>
        </div>
        
        <table className="consents-table">
          <thead>
            <tr>
              <th className="checkbox-cell">
                <input 
                  type="checkbox" 
                  onChange={handleSelectAll}
                  checked={selectedIds.length === consents.length && consents.length > 0}
                />
              </th>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                Name {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                Email {sortBy === 'email' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>
                Created {sortBy === 'createdAt' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('updatedAt')} style={{ cursor: 'pointer' }}>
                Updated {sortBy === 'updatedAt' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th>Options</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {consents.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px' }}>
                  No consent records found.
                </td>
              </tr>
            ) : (
              consents.map(consent => (
                <tr key={consent.id}>
                  <td>
                    <input 
                      type="checkbox"
                      checked={selectedIds.includes(consent.id!)}
                      onChange={e => handleSelect(consent.id!, e.target.checked)}
                    />
                  </td>
                  <td>{consent.name}</td>
                  <td>{consent.email}</td>
                  <td>{formatDate(consent.createdAt)}</td>
                  <td>{formatDate(consent.updatedAt)}</td>
                  <td>{consent.consentOptions.filter(o => o.checked).length} / {consent.consentOptions.length}</td>
                  <td className="consent-actions">
                    <button className="view-btn" title="View Details">👁️</button>
                    <button 
                      className="delete-btn" 
                      title="Delete Record"
                      onClick={() => handleDelete(consent.id!)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
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
      </div>
    </div>
  );
};

export default ConsentsList;