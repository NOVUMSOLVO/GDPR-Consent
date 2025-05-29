import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../Admin.css';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>GDPR Admin</h2>
          <p>Consent Management System</p>
        </div>
        <ul className="admin-nav">
          <li>
            <NavLink to="/admin/dashboard" end>Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/admin/consents">Consent Records</NavLink>
          </li>
          <li>
            <NavLink to="/admin/audit-logs">Audit Logs</NavLink>
          </li>
          <li>
            <NavLink to="/admin/settings">Settings</NavLink>
          </li>
        </ul>
      </aside>
      <main className="admin-content">
        <header className="admin-header">
          <h1>GDPR Consent Admin</h1>
          <button className="admin-logout" onClick={handleLogout}>
            Logout
          </button>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;