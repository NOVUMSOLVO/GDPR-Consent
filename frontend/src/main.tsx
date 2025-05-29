import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate, redirect } from 'react-router-dom';
import App from './App';
import AdminLogin from './components/AdminLogin';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/AdminDashboard';
import ConsentsList from './components/ConsentsList';
import SettingsPage from './components/SettingsPage';
import AuditLogPage from './components/AuditLogPage';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/ToastProvider';
import ErrorBoundary from './components/ErrorBoundary';
import { AUTH_CONFIG } from './config';
import './App.css';
import './Admin.css';

// Simple authentication check for admin routes
const requireAuth = () => {
  const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  if (!token) {
    return redirect('/admin/login');
  }
  return null;
};

// Create router with all application routes
const router = createBrowserRouter([
  // Main consent application
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ErrorBoundary>
    )
  },

  // Admin routes
  {
    path: "/admin/login",
    element: (
      <ErrorBoundary>
        <ToastProvider>
          <AuthProvider sessionTimeoutMinutes={30}>
            <AdminLogin />
          </AuthProvider>
        </ToastProvider>
      </ErrorBoundary>
    )
  },
  {
    path: "/admin",
    element: (
      <ErrorBoundary>
        <ToastProvider>
          <AuthProvider sessionTimeoutMinutes={30}>
            <AdminLayout />
          </AuthProvider>
        </ToastProvider>
      </ErrorBoundary>
    ),
    loader: requireAuth,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />
      },
      {
        path: "dashboard",
        element: <AdminDashboard />
      },
      {
        path: "consents",
        element: <ConsentsList />
      },
      {
        path: "settings",
        element: <SettingsPage />
      },
      {
        path: "audit-logs",
        element: <AuditLogPage />
      }
    ]
  },

  // Catch-all redirect
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
