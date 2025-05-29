import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { addAuditLog } from './audit.controller';

// Data file path
const DATA_DIR = path.join(__dirname, '../../data');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default settings
const DEFAULT_SETTINGS = {
  general: {
    organizationName: 'Liverpool Pharmacy',
    contactEmail: 'admin@example.com',
    consentExpiryDays: 365, // 1 year
    language: 'en',
  },
  notifications: {
    emailNotifications: true,
    consentExpiryReminder: true,
    reminderDays: 30, // Notify 30 days before expiry
    adminEmail: 'admin@example.com',
  },
  consentOptions: [
    {
      id: 'consent-001',
      type: 'marketing',
      name: 'Marketing Communications',
      description: 'Allow us to send you marketing information about our products and services',
      required: false,
      active: true,
      defaultValue: false,
    },
    {
      id: 'consent-002',
      type: 'data_sharing',
      name: 'Data Sharing with Partners',
      description: 'Allow us to share your data with our trusted partners',
      required: false,
      active: true,
      defaultValue: false,
    },
    {
      id: 'consent-003',
      type: 'essential',
      name: 'Essential Communications',
      description: 'Allow us to send you important information about your prescriptions and orders',
      required: true,
      active: true,
      defaultValue: true,
    }
  ]
};

// Initialize settings file if it doesn't exist
if (!fs.existsSync(SETTINGS_FILE)) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
}

// Read settings from file
const readSettings = () => {
  try {
    const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading settings:', error);
    return DEFAULT_SETTINGS;
  }
};

// Write settings to file
const writeSettings = (settings: any) => {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing settings:', error);
    return false;
  }
};

// Get all settings
export const getSettings = (req: Request, res: Response) => {
  try {
    const settings = readSettings();
    return res.status(200).json(settings);
  } catch (error) {
    console.error('Error retrieving settings:', error);
    return res.status(500).json({ message: 'Failed to retrieve settings' });
  }
};

// Update general settings
export const updateGeneralSettings = (req: Request, res: Response) => {
  try {
    const settings = readSettings();
    const updatedSettings = {
      ...settings,
      general: { ...settings.general, ...req.body }
    };
    
    if (writeSettings(updatedSettings)) {
      // Log the action
      addAuditLog(
        'Updated general settings',
        'settings',
        req.user.userId,
        req.user.email,
        req.ip,
        req.get('User-Agent'),
        req.user.organizationId,
        req.user.role
      );
      
      return res.status(200).json({ message: 'General settings updated successfully', settings: updatedSettings.general });
    } else {
      return res.status(500).json({ message: 'Failed to update general settings' });
    }
  } catch (error) {
    console.error('Error updating general settings:', error);
    return res.status(500).json({ message: 'Failed to update general settings' });
  }
};

// Update notification settings
export const updateNotificationSettings = (req: Request, res: Response) => {
  try {
    const settings = readSettings();
    const updatedSettings = {
      ...settings,
      notifications: { ...settings.notifications, ...req.body }
    };
    
    if (writeSettings(updatedSettings)) {
      // Log the action
      addAuditLog(
        'Updated notification settings',
        'settings',
        req.user.userId,
        req.user.email,
        req.ip,
        req.get('User-Agent'),
        req.user.organizationId,
        req.user.role
      );
      
      return res.status(200).json({ message: 'Notification settings updated successfully', settings: updatedSettings.notifications });
    } else {
      return res.status(500).json({ message: 'Failed to update notification settings' });
    }
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return res.status(500).json({ message: 'Failed to update notification settings' });
  }
};

// Get consent options
export const getConsentOptions = (req: Request, res: Response) => {
  try {
    const settings = readSettings();
    return res.status(200).json(settings.consentOptions);
  } catch (error) {
    console.error('Error retrieving consent options:', error);
    return res.status(500).json({ message: 'Failed to retrieve consent options' });
  }
};

// Update consent options
export const updateConsentOptions = (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'Consent option ID is required' });
    }
    
    const settings = readSettings();
    const consentIndex = settings.consentOptions.findIndex((opt: any) => opt.id === id);
    
    if (consentIndex === -1) {
      return res.status(404).json({ message: 'Consent option not found' });
    }
    
    // Update the consent option
    settings.consentOptions[consentIndex] = {
      ...settings.consentOptions[consentIndex],
      ...req.body
    };
    
    if (writeSettings(settings)) {
      // Log the action
      addAuditLog(
        `Updated consent option: ${settings.consentOptions[consentIndex].name}`,
        'consent',
        req.user.userId,
        req.user.email,
        req.ip,
        req.get('User-Agent'),
        req.user.organizationId,
        req.user.role
      );
      
      return res.status(200).json({ message: 'Consent option updated successfully', option: settings.consentOptions[consentIndex] });
    } else {
      return res.status(500).json({ message: 'Failed to update consent option' });
    }
  } catch (error) {
    console.error('Error updating consent option:', error);
    return res.status(500).json({ message: 'Failed to update consent option' });
  }
};

// Add a new consent option
export const addConsentOption = (req: Request, res: Response) => {
  try {
    const { type, name, description, required, active, defaultValue } = req.body;
    
    if (!type || !name || !description) {
      return res.status(400).json({ message: 'Type, name, and description are required' });
    }
    
    const newOption = {
      id: `consent-${uuidv4().substring(0, 8)}`,
      type,
      name,
      description,
      required: !!required,
      active: active !== undefined ? active : true,
      defaultValue: !!defaultValue
    };
    
    const settings = readSettings();
    settings.consentOptions.push(newOption);
    
    if (writeSettings(settings)) {
      // Log the action
      addAuditLog(
        `Added new consent option: ${name}`,
        'consent',
        req.user.userId,
        req.user.email,
        req.ip,
        req.get('User-Agent'),
        req.user.organizationId,
        req.user.role
      );
      
      return res.status(201).json({ message: 'Consent option added successfully', option: newOption });
    } else {
      return res.status(500).json({ message: 'Failed to add consent option' });
    }
  } catch (error) {
    console.error('Error adding consent option:', error);
    return res.status(500).json({ message: 'Failed to add consent option' });
  }
};

// Delete a consent option
export const deleteConsentOption = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'Consent option ID is required' });
    }
    
    const settings = readSettings();
    const optionToDelete = settings.consentOptions.find((opt: any) => opt.id === id);
    
    if (!optionToDelete) {
      return res.status(404).json({ message: 'Consent option not found' });
    }
    
    // Filter out the deleted option
    settings.consentOptions = settings.consentOptions.filter((opt: any) => opt.id !== id);
    
    if (writeSettings(settings)) {
      // Log the action
      addAuditLog(
        `Deleted consent option: ${optionToDelete.name}`,
        'consent',
        req.user.userId,
        req.user.email,
        req.ip,
        req.get('User-Agent'),
        req.user.organizationId,
        req.user.role
      );
      
      return res.status(200).json({ message: 'Consent option deleted successfully' });
    } else {
      return res.status(500).json({ message: 'Failed to delete consent option' });
    }
  } catch (error) {
    console.error('Error deleting consent option:', error);
    return res.status(500).json({ message: 'Failed to delete consent option' });
  }
};