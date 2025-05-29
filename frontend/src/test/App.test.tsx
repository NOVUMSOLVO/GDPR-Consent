import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import { ToastProvider } from '../components/ToastProvider';
import * as api from '../services/api';

// Mock the API module
vi.mock('../services/api', () => ({
  getDefaultConsentOptions: vi.fn(),
  saveUserConsent: vi.fn(),
  getUserConsent: vi.fn(),
}));

const mockApi = api as any;

const renderApp = () => {
  return render(
    <BrowserRouter>
      <ToastProvider>
        <App />
      </ToastProvider>
    </BrowserRouter>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock default consent options
    mockApi.getDefaultConsentOptions.mockResolvedValue([
      {
        id: 'necessary',
        title: 'Necessary Cookies',
        description: 'Required for basic functionality',
        required: true,
        checked: true,
      },
      {
        id: 'analytics',
        title: 'Analytics Cookies',
        description: 'Help us improve our service',
        required: false,
        checked: false,
      },
    ]);
  });

  it('renders the main heading', async () => {
    renderApp();

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });

  it('displays language selector', async () => {
    renderApp();

    await waitFor(() => {
      const languageSelect = screen.getByRole('combobox');
      expect(languageSelect).toBeInTheDocument();
    });
  });

  it('loads and displays consent options', async () => {
    renderApp();

    await waitFor(() => {
      expect(screen.getByText('Necessary Cookies')).toBeInTheDocument();
      expect(screen.getByText('Analytics Cookies')).toBeInTheDocument();
    });
  });

  it('shows form validation errors for empty required fields', async () => {
    renderApp();

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /save preferences/i });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    mockApi.saveUserConsent.mockResolvedValue({
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      consentOptions: [],
    });

    renderApp();

    await waitFor(() => {
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    });

    const submitButton = screen.getByRole('button', { name: /save preferences/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockApi.saveUserConsent).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
        })
      );
    });
  });

  it('displays success message after successful submission', async () => {
    mockApi.saveUserConsent.mockResolvedValue({
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      consentOptions: [],
    });

    renderApp();

    await waitFor(() => {
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    });

    const submitButton = screen.getByRole('button', { name: /save preferences/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/preferences saved successfully/i)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    mockApi.saveUserConsent.mockRejectedValue(new Error('API Error'));

    renderApp();

    await waitFor(() => {
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    });

    const submitButton = screen.getByRole('button', { name: /save preferences/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to save consent preferences/i)).toBeInTheDocument();
    });
  });
});
