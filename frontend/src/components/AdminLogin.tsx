import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminLogin } from '../services/admin.api';
import { ValidationError } from '../types';
import { useAuth } from '../contexts/AuthContext';
import '../Admin.css';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  // Display session timeout message if redirected from expired session
  const sessionExpiredMessage = location.state?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    const newErrors: ValidationError[] = [];
    if (!email.trim()) {
      newErrors.push({ field: 'email', message: 'Email is required' });
    }
    if (!password.trim()) {
      newErrors.push({ field: 'password', message: 'Password is required' });
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      console.log('Attempting login with:', { email, password });
      const response = await adminLogin({ email, password });
      console.log('Login response:', response);
      // Use auth context to handle login and session management
      auth.login(response.token);
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setErrors([{ field: 'form', message: 'Invalid credentials. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Admin Login</h1>

        {sessionExpiredMessage && (
          <div className="session-expired-message">
            {sessionExpiredMessage}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={loading}
          />
          {errors.find(e => e.field === 'email') && (
            <p className="error-message">
              {errors.find(e => e.field === 'email')?.message}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={loading}
          />
          {errors.find(e => e.field === 'password') && (
            <p className="error-message">
              {errors.find(e => e.field === 'password')?.message}
            </p>
          )}
        </div>

        {errors.find(e => e.field === 'form') && (
          <p className="error-message">
            {errors.find(e => e.field === 'form')?.message}
          </p>
        )}

        <div className="form-group">
          <button
            type="submit"
            className="button button-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.8rem', marginTop: '20px' }}>
          <strong>Demo credentials:</strong><br />
          Email: admin@example.com<br />
          Password: pharmacy123
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;