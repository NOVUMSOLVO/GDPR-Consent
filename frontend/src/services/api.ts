import { ConsentOption, UserConsent } from '../types';
import { apiClient } from './apiClient';

/**
 * Save user consent preferences to the backend
 */
export const saveUserConsent = async (userConsent: UserConsent): Promise<UserConsent> => {
  try {
    return await apiClient.post('/consent', userConsent);
  } catch (error) {
    console.error('Error saving consent preferences:', error);
    throw error;
  }
};

/**
 * Retrieve user consent preferences by email
 */
export const getUserConsent = async (email: string): Promise<UserConsent | null> => {
  try {
    const response = await apiClient.get(`/consent/${encodeURIComponent(email)}`);
    return response;
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return null; // User not found
    }
    console.error('Error retrieving consent preferences:', error);
    throw error;
  }
};

/**
 * Get the default consent options
 */
export const getDefaultConsentOptions = async (): Promise<ConsentOption[]> => {
  try {
    return await apiClient.get('/consent/defaults');
  } catch (error) {
    // If API call fails, return default options
    console.error('Error retrieving default consent options:', error);
    return [
      {
        id: 'necessary',
        title: 'Necessary Cookies',
        description: 'These cookies are required for basic site functionality and are always enabled.',
        required: true,
        checked: true,
      },
      {
        id: 'functional',
        title: 'Functional Cookies',
        description: 'These cookies allow us to remember choices you make and provide enhanced features.',
        required: false,
        checked: false,
      },
      {
        id: 'analytics',
        title: 'Analytics Cookies',
        description: 'These cookies help us understand how visitors interact with our website.',
        required: false,
        checked: false,
      },
      {
        id: 'marketing',
        title: 'Marketing Cookies',
        description: 'These cookies are used to deliver advertisements more relevant to you and your interests.',
        required: false,
        checked: false,
      },
      {
        id: 'thirdParty',
        title: 'Third Party Cookies',
        description: 'These cookies collect information to help better tailor advertising to your interests.',
        required: false,
        checked: false,
      }
    ];
  }
};