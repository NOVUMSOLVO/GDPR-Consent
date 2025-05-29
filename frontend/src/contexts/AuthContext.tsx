import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { AUTH_CONFIG } from '../config';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  sessionTimeoutMinutes?: number;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  sessionTimeoutMinutes = AUTH_CONFIG.SESSION_TIMEOUT_MINUTES
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [sessionTimeout, setSessionTimeout] = useState<number | null>(null);
  const navigate = useNavigate();

  // Check if user is authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    if (token) {
      setIsAuthenticated(true);
      startSessionTimer();
    }
  }, []);

  // Add event listeners for user activity to refresh session
  useEffect(() => {
    if (isAuthenticated) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

      const refreshOnActivity = () => refreshSession();

      events.forEach(event => {
        window.addEventListener(event, refreshOnActivity);
      });

      return () => {
        events.forEach(event => {
          window.removeEventListener(event, refreshOnActivity);
        });
      };
    }
  }, [isAuthenticated]);

  const startSessionTimer = () => {
    // Clear any existing timeout
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }

    // Set new timeout
    const timeout = window.setTimeout(() => {
      // Session expired, log the user out
      logout();
      navigate('/admin/login', {
        state: { message: 'Your session has expired. Please log in again.' }
      });
    }, sessionTimeoutMinutes * 60 * 1000);

    setSessionTimeout(timeout);
  };

  const login = (token: string) => {
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
    setIsAuthenticated(true);
    startSessionTimer();

    // Log this action
    logAction('User logged in', 'auth');
  };

  const logout = () => {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    setIsAuthenticated(false);

    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
      setSessionTimeout(null);
    }

    // Log this action
    logAction('User logged out', 'auth');
  };

  const refreshSession = () => {
    if (isAuthenticated) {
      startSessionTimer();
    }
  };

  // Audit logging function
  const logAction = async (action: string, category: string) => {
    try {
      const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
      if (!token) return;

      await apiClient.post('/admin/audit-log', {
        action,
        category,
        timestamp: new Date().toISOString()
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Failed to log action:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;