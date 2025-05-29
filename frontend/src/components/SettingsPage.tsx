import React, { useState, useEffect } from 'react';
import { getDefaultConsentOptions } from '../services/api';
import { ConsentOption } from '../types';
import { useNavigate } from 'react-router-dom';
import { AUTH_CONFIG } from '../config';
import './SettingsStyles.css';

import { apiClient } from '../services/apiClient';

// Settings API functions
const saveConsentOptions = async (options: ConsentOption[]): Promise<void> => {
  try {
    await apiClient.authRequest('/admin/settings/consent-options', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ options }),
    });
  } catch (error) {
    console.error('Error saving consent options:', error);
    throw error;
  }
};

const getSystemSettings = async (): Promise<any> => {
  try {
    return await apiClient.authRequest('/admin/settings');
  } catch (error) {
    console.error('Error fetching system settings:', error);
    throw error;
  }
};

const saveSystemSettings = async (settings: any): Promise<void> => {
  try {
    await apiClient.authRequest('/admin/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
  } catch (error) {
    console.error('Error saving system settings:', error);
    throw error;
  }
};

const SettingsPage: React.FC = () => {
  const [consentOptions, setConsentOptions] = useState<ConsentOption[]>([]);
  const [newOption, setNewOption] = useState<ConsentOption>({
    id: '',
    title: '',
    description: '',
    required: false,
    checked: false,
  });
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [systemSettings, setSystemSettings] = useState({
    sessionTimeoutMinutes: 30,
    enableAuditLogging: true,
    enableNotifications: false,
    dataRetentionDays: 365,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const options = await getDefaultConsentOptions();
      setConsentOptions(options);

      try {
        const settings = await getSystemSettings();
        setSystemSettings(settings);
      } catch (err) {
        // If system settings endpoint isn't implemented yet, just use defaults
        console.warn('Could not fetch system settings, using defaults');
      }

      setError(null);
    } catch (err) {
      setError('Failed to load settings');
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOption = () => {
    if (!newOption.id || !newOption.title || !newOption.description) {
      setError('All fields are required when adding a new option');
      return;
    }

    // Check for duplicate ID
    if (consentOptions.some(option => option.id === newOption.id)) {
      setError('An option with this ID already exists');
      return;
    }

    setConsentOptions([...consentOptions, newOption]);
    setNewOption({
      id: '',
      title: '',
      description: '',
      required: false,
      checked: false,
    });
    setIsAddingOption(false);
    setError(null);
  };

  const handleRemoveOption = (id: string) => {
    setConsentOptions(consentOptions.filter(option => option.id !== id));
  };

  const handleOptionChange = (id: string, field: keyof ConsentOption, value: any) => {
    setConsentOptions(
      consentOptions.map(option =>
        option.id === id ? { ...option, [field]: value } : option
      )
    );
  };

  const handleSystemSettingChange = (setting: string, value: any) => {
    setSystemSettings({
      ...systemSettings,
      [setting]: value,
    });
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      await saveConsentOptions(consentOptions);
      await saveSystemSettings(systemSettings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save settings');
      console.error('Error saving settings:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && consentOptions.length === 0) {
    return (
      <div className="settings-loading">
        <div className="settings-loading-spinner"></div>
        <div>Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>System Settings</h2>
        <p>Configure consent options and system settings for your GDPR compliance.</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {saveSuccess && (
        <div className="success-message">
          Settings saved successfully!
        </div>
      )}

      <div className="settings-section">
        <h3>Consent Options</h3>
        <p>Configure the consent options presented to users for GDPR compliance.</p>

        <div className="consent-options-list">
          {consentOptions.map(option => (
            <div key={option.id} className="settings-card">
              <div className="settings-card-header">
                <h4>{option.title}</h4>
                <div>
                  {!option.id.startsWith('necessary') && (
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() => handleRemoveOption(option.id)}
                      style={{ color: '#e74c3c', borderColor: '#e74c3c' }}
                    >
                      <span role="img" aria-label="delete">🗑️</span> Remove
                    </button>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Option ID</label>
                <input
                  type="text"
                  value={option.id}
                  disabled={true}
                />
                {option.id === 'necessary' && (
                  <small style={{ display: 'block', marginTop: '5px', color: '#7f8c8d' }}>
                    This is a required option and cannot be modified or removed.
                  </small>
                )}
              </div>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={option.title}
                  onChange={(e) => handleOptionChange(option.id, 'title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={option.description}
                  onChange={(e) => handleOptionChange(option.id, 'description', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="form-group checkbox-group">
                <label className="toggle-container">
                  <span className="toggle-label">Required</span>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={option.required}
                      onChange={(e) => handleOptionChange(option.id, 'required', e.target.checked)}
                      disabled={option.id === 'necessary'}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                  <span className="toggle-description">Cannot be declined by users</span>
                </label>
              </div>
              <div className="form-group checkbox-group">
                <label className="toggle-container">
                  <span className="toggle-label">Default State</span>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={option.checked}
                      onChange={(e) => handleOptionChange(option.id, 'checked', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                  <span className="toggle-description">Checked by default</span>
                </label>
              </div>
            </div>
          ))}

          {isAddingOption ? (
            <div className="settings-card" style={{ borderLeft: '4px solid #3498db' }}>
              <div className="settings-card-header">
                <h4>New Consent Option</h4>
                <div>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => setIsAddingOption(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Option ID</label>
                <input
                  type="text"
                  value={newOption.id}
                  onChange={(e) => setNewOption({ ...newOption, id: e.target.value })}
                  placeholder="E.g., analytics, marketing"
                />
                <small style={{ display: 'block', marginTop: '5px', color: '#7f8c8d' }}>
                  Use a unique identifier without spaces (e.g., "analytics", "marketing").
                </small>
              </div>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newOption.title}
                  onChange={(e) => setNewOption({ ...newOption, title: e.target.value })}
                  placeholder="E.g., Analytics Cookies"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newOption.description}
                  onChange={(e) => setNewOption({ ...newOption, description: e.target.value })}
                  rows={3}
                  placeholder="Describe what this consent option is for..."
                />
              </div>
              <div className="form-group checkbox-group">
                <label className="toggle-container">
                  <span className="toggle-label">Required</span>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={newOption.required}
                      onChange={(e) => setNewOption({ ...newOption, required: e.target.checked })}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                  <span className="toggle-description">Cannot be declined by users</span>
                </label>
              </div>
              <div className="form-group checkbox-group">
                <label className="toggle-container">
                  <span className="toggle-label">Default State</span>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={newOption.checked}
                      onChange={(e) => setNewOption({ ...newOption, checked: e.target.checked })}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                  <span className="toggle-description">Checked by default</span>
                </label>
              </div>
              <div className="form-group">
                <button
                  type="button"
                  className="button button-primary"
                  onClick={handleAddOption}
                >
                  <span role="img" aria-label="add">➕</span> Add Option
                </button>
              </div>
            </div>
          ) : (
            <div className="add-option-btn">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setIsAddingOption(true)}
              >
                <span role="img" aria-label="add">➕</span> Add Consent Option
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="settings-section">
        <h3>System Settings</h3>
        <p>Configure global system settings for your GDPR compliance platform.</p>

        <div className="settings-card">
          <div className="form-group">
            <label>Admin Session Timeout</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="number"
                value={systemSettings.sessionTimeoutMinutes}
                onChange={(e) => handleSystemSettingChange('sessionTimeoutMinutes', parseInt(e.target.value))}
                min={1}
                max={1440}
                style={{ maxWidth: '100px' }}
              />
              <span>minutes</span>
            </div>
            <small style={{ display: 'block', marginTop: '5px', color: '#7f8c8d' }}>
              How long before an inactive admin session expires (1-1440 minutes).
            </small>
          </div>

          <div className="form-group checkbox-group">
            <label className="toggle-container">
              <span className="toggle-label">Audit Logging</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={systemSettings.enableAuditLogging}
                  onChange={(e) => handleSystemSettingChange('enableAuditLogging', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </div>
              <span className="toggle-description">Track all system activities for compliance</span>
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label className="toggle-container">
              <span className="toggle-label">Email Notifications</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={systemSettings.enableNotifications}
                  onChange={(e) => handleSystemSettingChange('enableNotifications', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </div>
              <span className="toggle-description">Send email alerts for important events</span>
            </label>
          </div>

          <div className="form-group">
            <label>Data Retention Period</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="number"
                value={systemSettings.dataRetentionDays}
                onChange={(e) => handleSystemSettingChange('dataRetentionDays', parseInt(e.target.value))}
                min={30}
                max={3650}
                style={{ maxWidth: '100px' }}
              />
              <span>days</span>
            </div>
            <small style={{ display: 'block', marginTop: '5px', color: '#7f8c8d' }}>
              How long to keep consent records (30-3650 days). GDPR requires minimum retention.
            </small>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button
          type="button"
          className="button button-primary"
          onClick={handleSaveSettings}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="settings-loading-spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
              Saving...
            </>
          ) : (
            <>
              <span role="img" aria-label="save">💾</span> Save All Settings
            </>
          )}
        </button>
        <button
          type="button"
          className="button button-secondary"
          onClick={loadSettings}
          disabled={loading}
        >
          <span role="img" aria-label="reset">🔄</span> Reset Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;