import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="error-boundary">
      <div className="error-boundary-content">
        <h2>Oops! Something went wrong</h2>
        <p>We're sorry, but something unexpected happened. Please try again.</p>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="error-details">
            <summary>Error Details (Development Only)</summary>
            <pre>{error.message}</pre>
            <pre>{error.stack}</pre>
          </details>
        )}
        
        <div className="error-actions">
          <button 
            onClick={resetErrorBoundary}
            className="button button-primary"
          >
            Try Again
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="button button-secondary"
          >
            Go Home
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .error-boundary {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background-color: #f8f9fa;
        }
        
        .error-boundary-content {
          max-width: 500px;
          text-align: center;
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .error-boundary-content h2 {
          color: #e74c3c;
          margin-bottom: 16px;
        }
        
        .error-boundary-content p {
          color: #666;
          margin-bottom: 24px;
          line-height: 1.5;
        }
        
        .error-details {
          text-align: left;
          margin: 20px 0;
          padding: 16px;
          background-color: #f8f9fa;
          border-radius: 4px;
          border: 1px solid #dee2e6;
        }
        
        .error-details summary {
          cursor: pointer;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .error-details pre {
          font-size: 12px;
          color: #e74c3c;
          white-space: pre-wrap;
          word-break: break-word;
        }
        
        .error-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        
        .button {
          padding: 12px 24px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s ease;
        }
        
        .button-primary {
          background-color: #3498db;
          color: white;
        }
        
        .button-primary:hover {
          background-color: #2980b9;
        }
        
        .button-secondary {
          background-color: #95a5a6;
          color: white;
        }
        
        .button-secondary:hover {
          background-color: #7f8c8d;
        }
      `}</style>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, onError }) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
    
    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }
    
    // In production, you might want to send this to an error reporting service
    // Example: Sentry, LogRocket, etc.
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={() => {
        // Clear any error state
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
