import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message });
  }, [addToast]);

  const error = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message, duration: 7000 });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message });
  }, [addToast]);

  const info = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{
      toasts,
      addToast,
      removeToast,
      success,
      error,
      warning,
      info,
    }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
      
      <style jsx>{`
        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-width: 400px;
        }
        
        @media (max-width: 768px) {
          .toast-container {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const getToastStyles = (type: Toast['type']) => {
    const baseStyles = {
      backgroundColor: '#fff',
      border: '1px solid',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      position: 'relative' as const,
      animation: 'slideIn 0.3s ease-out',
    };

    switch (type) {
      case 'success':
        return { ...baseStyles, borderColor: '#10b981', backgroundColor: '#f0fdf4' };
      case 'error':
        return { ...baseStyles, borderColor: '#ef4444', backgroundColor: '#fef2f2' };
      case 'warning':
        return { ...baseStyles, borderColor: '#f59e0b', backgroundColor: '#fffbeb' };
      case 'info':
        return { ...baseStyles, borderColor: '#3b82f6', backgroundColor: '#eff6ff' };
      default:
        return baseStyles;
    }
  };

  const getIconColor = (type: Toast['type']) => {
    switch (type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '•';
    }
  };

  return (
    <div style={getToastStyles(toast.type)}>
      <div className="toast-content">
        <div className="toast-icon" style={{ color: getIconColor(toast.type) }}>
          {getIcon(toast.type)}
        </div>
        <div className="toast-text">
          <div className="toast-title">{toast.title}</div>
          {toast.message && <div className="toast-message">{toast.message}</div>}
        </div>
        <button 
          className="toast-close"
          onClick={() => onRemove(toast.id)}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
      
      {toast.action && (
        <div className="toast-action">
          <button 
            className="toast-action-button"
            onClick={toast.action.onClick}
          >
            {toast.action.label}
          </button>
        </div>
      )}
      
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .toast-content {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        
        .toast-icon {
          font-size: 18px;
          font-weight: bold;
          flex-shrink: 0;
          margin-top: 2px;
        }
        
        .toast-text {
          flex: 1;
        }
        
        .toast-title {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }
        
        .toast-message {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.4;
        }
        
        .toast-close {
          background: none;
          border: none;
          font-size: 20px;
          color: #9ca3af;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .toast-close:hover {
          background-color: rgba(0, 0, 0, 0.1);
          color: #374151;
        }
        
        .toast-action {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .toast-action-button {
          background: none;
          border: 1px solid currentColor;
          color: ${getIconColor(toast.type)};
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .toast-action-button:hover {
          background-color: ${getIconColor(toast.type)};
          color: white;
        }
      `}</style>
    </div>
  );
};
