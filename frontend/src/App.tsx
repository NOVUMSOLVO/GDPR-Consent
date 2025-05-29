import React, { useState, useEffect } from 'react';
import { Language, UserConsent, ConsentOption, ValidationError } from './types';
import { getString, getAvailableLanguages } from './i18n';
import { validateForm } from './utils/validation';
import { saveUserConsent, getUserConsent, getDefaultConsentOptions } from './services/api';
import { Link } from 'react-router-dom';
import { useConsentForm } from './hooks/useFormValidation';
import { useToast } from './components/ToastProvider';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consentOptions, setConsentOptions] = useState<ConsentOption[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [existingConsent, setExistingConsent] = useState<UserConsent | null>(null);

  // Enhanced form validation and toast notifications
  const toast = useToast();

  useEffect(() => {
    loadDefaultOptions();
  }, []);

  const loadDefaultOptions = async () => {
    try {
      const options = await getDefaultConsentOptions();
      setConsentOptions(options);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load default options:', error);
      setLoading(false);
    }
  };

  const handleEmailBlur = async () => {
    if (email) {
      try {
        const existing = await getUserConsent(email);
        if (existing) {
          setExistingConsent(existing);
        }
      } catch (error) {
        console.error('Error checking existing consent:', error);
      }
    }
  };

  const loadExistingConsent = () => {
    if (existingConsent) {
      setName(existingConsent.name);
      setConsentOptions(existingConsent.consentOptions);
      setExistingConsent(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(name, email);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast.error('Validation Error', 'Please fix the errors below and try again.');
      return;
    }

    setLoading(true);
    try {
      const userConsent: UserConsent = {
        name,
        email,
        consentOptions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveUserConsent(userConsent);
      setSuccess(true);
      setErrors([]);

      toast.success(
        'Preferences Saved Successfully!',
        'Your consent preferences have been recorded and will be respected in all our communications.'
      );

      // Reset form after successful submission
      setTimeout(() => {
        setName('');
        setEmail('');
        setSuccess(false);
        loadDefaultOptions(); // Reload default options
      }, 3000);

    } catch (error) {
      console.error('Error saving consent:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrors([{ field: 'submit', message: 'Failed to save consent preferences' }]);
      toast.error(
        'Failed to Save Preferences',
        `There was an error saving your preferences: ${errorMessage}. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConsentToggle = (id: string) => {
    setConsentOptions(options =>
      options.map(option =>
        option.id === id && !option.required
          ? { ...option, checked: !option.checked }
          : option
      )
    );
  };

  const acceptAll = () => {
    setConsentOptions(options =>
      options.map(option => ({ ...option, checked: true }))
    );
  };

  const rejectNonEssential = () => {
    setConsentOptions(options =>
      options.map(option =>
        option.required
          ? { ...option, checked: true }
          : { ...option, checked: false }
      )
    );
  };

  if (loading) {
    return <div className="loading">{getString('loading', language)}</div>;
  }

  return (
    <div className="gdpr-consent-app">
      <header className="header">
        <h1>{getString('app.title', language)}</h1>
        <p className="subtitle">{getString('app.subtitle', language)}</p>
        <div className="language-selector">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
          >
            {getAvailableLanguages().map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="consent-container">
        {existingConsent && (
          <div className="existing-consent">
            <p>{getString('retrieve.message', language)}</p>
            <button
              className="button button-secondary"
              onClick={loadExistingConsent}
            >
              {getString('retrieve.action', language)}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <section className="user-info">
            <h2>{getString('consent.userInfo', language)}</h2>
            <div className="form-group">
              <label htmlFor="name">{getString('form.name', language)}</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={getString('form.name.placeholder', language)}
              />
              {errors.find(e => e.field === 'name') && (
                <p className="error-message">
                  {errors.find(e => e.field === 'name')?.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">{getString('form.email', language)}</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                placeholder={getString('form.email.placeholder', language)}
              />
              {errors.find(e => e.field === 'email') && (
                <p className="error-message">
                  {errors.find(e => e.field === 'email')?.message}
                </p>
              )}
            </div>
          </section>

          <section className="consent-options">
            <h2>{getString('consent.preferences', language)}</h2>
            <p>{getString('consent.introduction', language)}</p>
            <div className="button-group">
              <button
                type="button"
                className="button button-secondary"
                onClick={acceptAll}
              >
                {getString('button.acceptAll', language)}
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={rejectNonEssential}
              >
                {getString('button.rejectNonEssential', language)}
              </button>
            </div>

            <div className="consent-options-list">
              {consentOptions.map(option => (
                <div
                  key={option.id}
                  className={`consent-option ${option.required ? 'required' : ''}`}
                >
                  <div className="consent-option-header">
                    <label className="consent-option-title">
                      <input
                        type="checkbox"
                        checked={option.checked}
                        onChange={() => handleConsentToggle(option.id)}
                        disabled={option.required}
                      />
                      {option.title}
                      {option.required && (
                        <span className="required-badge">
                          {getString('badge.required', language)}
                        </span>
                      )}
                    </label>
                  </div>
                  <p className="consent-option-description">{option.description}</p>
                </div>
              ))}
            </div>
          </section>

          {errors.find(e => e.field === 'submit') && (
            <p className="error-message">
              {errors.find(e => e.field === 'submit')?.message}
            </p>
          )}

          <div className="button-group">
            <button type="submit" className="button button-primary">
              {getString('button.savePreferences', language)}
            </button>
          </div>
        </form>

        {success && (
          <div className="success-message">
            <h3>{getString('consent.success.title', language)}</h3>
            <p>{getString('consent.success.message', language)}</p>
          </div>
        )}
      </main>

      <footer style={{ textAlign: 'center', marginTop: '20px', padding: '10px', borderTop: '1px solid #eaeaea' }}>
        <Link to="/admin/login" style={{ color: '#3498db', textDecoration: 'none', fontSize: '0.9rem' }}>
          Admin Dashboard
        </Link>
      </footer>
    </div>
  );
};

export default App;
