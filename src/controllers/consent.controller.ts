import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Simple file-based storage for consent data
const DATA_DIR = path.join(__dirname, '../../data');
const CONSENT_FILE = path.join(DATA_DIR, 'consent-data.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize empty consent data file if it doesn't exist
if (!fs.existsSync(CONSENT_FILE)) {
  fs.writeFileSync(CONSENT_FILE, JSON.stringify([], null, 2));
}

// Read consent data from file
const readConsentData = (): any[] => {
  try {
    const data = fs.readFileSync(CONSENT_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading consent data:', error);
    return [];
  }
};

// Write consent data to file
const writeConsentData = (data: any[]): void => {
  try {
    fs.writeFileSync(CONSENT_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing consent data:', error);
  }
};

// Default consent options
export const getDefaultConsentOptions = (req: Request, res: Response) => {
  const defaultOptions = [
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

  return res.status(200).json(defaultOptions);
};

// Save user consent
export const saveUserConsent = (req: Request, res: Response) => {
  try {
    const { name, email, consentOptions } = req.body;

    if (!name || !email || !consentOptions) {
      return res.status(400).json({ message: 'Name, email, and consent options are required' });
    }

    const consentData = readConsentData();
    
    // Check if we already have consent data for this email
    const existingIndex = consentData.findIndex((item: any) => item.email === email);
    
    const now = new Date().toISOString();
    const consentRecord = {
      id: existingIndex >= 0 ? consentData[existingIndex].id : uuidv4(),
      name,
      email,
      consentOptions,
      createdAt: existingIndex >= 0 ? consentData[existingIndex].createdAt : now,
      updatedAt: now
    };

    if (existingIndex >= 0) {
      // Update existing record
      consentData[existingIndex] = consentRecord;
    } else {
      // Add new record
      consentData.push(consentRecord);
    }

    writeConsentData(consentData);
    
    return res.status(200).json(consentRecord);
  } catch (error) {
    console.error('Error saving user consent:', error);
    return res.status(500).json({ message: 'Failed to save consent preferences' });
  }
};

// Get user consent by email
export const getUserConsent = (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const consentData = readConsentData();
    const userConsent = consentData.find((item: any) => item.email === email);
    
    if (!userConsent) {
      return res.status(404).json({ message: 'No consent record found for this email' });
    }
    
    return res.status(200).json(userConsent);
  } catch (error) {
    console.error('Error retrieving user consent:', error);
    return res.status(500).json({ message: 'Failed to retrieve consent preferences' });
  }
};

// ADMIN OPERATIONS

// Get all consent records with pagination and filtering
export const getAllConsents = (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', search = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;
    
    const consentData = readConsentData();
    
    // Filter by search term if provided
    let filteredData = consentData;
    if (search) {
      const searchLower = (search as string).toLowerCase();
      filteredData = consentData.filter(item => 
        item.name.toLowerCase().includes(searchLower) || 
        item.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort data
    const sortedData = filteredData.sort((a, b) => {
      const field = sortBy as string;
      const order = sortOrder as string;
      
      if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
      return 0;
    });
    
    // Paginate
    const paginatedData = sortedData.slice(skip, skip + limitNum);
    
    return res.status(200).json({
      data: paginatedData,
      pagination: {
        total: filteredData.length,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(filteredData.length / limitNum)
      }
    });
  } catch (error) {
    console.error('Error retrieving consent records:', error);
    return res.status(500).json({ message: 'Failed to retrieve consent records' });
  }
};

// Get consent record by ID
export const getConsentById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'Consent ID is required' });
    }

    const consentData = readConsentData();
    const consentRecord = consentData.find(item => item.id === id);
    
    if (!consentRecord) {
      return res.status(404).json({ message: 'Consent record not found' });
    }
    
    return res.status(200).json(consentRecord);
  } catch (error) {
    console.error('Error retrieving consent record:', error);
    return res.status(500).json({ message: 'Failed to retrieve consent record' });
  }
};

// Delete consent record by ID
export const deleteConsent = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'Consent ID is required' });
    }

    const consentData = readConsentData();
    const index = consentData.findIndex(item => item.id === id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Consent record not found' });
    }
    
    // Remove the record
    consentData.splice(index, 1);
    writeConsentData(consentData);
    
    return res.status(200).json({ message: 'Consent record deleted successfully' });
  } catch (error) {
    console.error('Error deleting consent record:', error);
    return res.status(500).json({ message: 'Failed to delete consent record' });
  }
};

// Bulk delete consent records
export const bulkDeleteConsents = (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Valid consent IDs array is required' });
    }

    const consentData = readConsentData();
    const idsSet = new Set(ids);
    
    // Filter out records to be deleted
    const updatedData = consentData.filter(item => !idsSet.has(item.id));
    
    // Check if any records were removed
    if (consentData.length === updatedData.length) {
      return res.status(404).json({ message: 'No matching consent records found' });
    }
    
    writeConsentData(updatedData);
    
    return res.status(200).json({ 
      message: 'Consent records deleted successfully',
      count: consentData.length - updatedData.length
    });
  } catch (error) {
    console.error('Error deleting consent records:', error);
    return res.status(500).json({ message: 'Failed to delete consent records' });
  }
};

// Get consent statistics
export const getConsentStats = (req: Request, res: Response) => {
  try {
    const consentData = readConsentData();
    
    // Get total consents
    const totalConsents = consentData.length;
    
    // Get consents by option type
    const consentsByOption: Record<string, { total: number, accepted: number }> = {};
    
    // Process each consent record
    consentData.forEach(consent => {
      consent.consentOptions.forEach((option: any) => {
        if (!consentsByOption[option.id]) {
          consentsByOption[option.id] = { total: 0, accepted: 0 };
        }
        
        consentsByOption[option.id].total++;
        
        if (option.checked) {
          consentsByOption[option.id].accepted++;
        }
      });
    });
    
    // Calculate consent rates
    const consentRates = Object.entries(consentsByOption).map(([id, stats]) => ({
      id,
      total: stats.total,
      accepted: stats.accepted,
      rate: stats.total > 0 ? (stats.accepted / stats.total) * 100 : 0
    }));
    
    // Get consents created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentConsents = consentData.filter(consent => 
      new Date(consent.createdAt) >= thirtyDaysAgo
    ).length;
    
    return res.status(200).json({
      totalConsents,
      recentConsents,
      consentRates
    });
  } catch (error) {
    console.error('Error retrieving consent statistics:', error);
    return res.status(500).json({ message: 'Failed to retrieve consent statistics' });
  }
};