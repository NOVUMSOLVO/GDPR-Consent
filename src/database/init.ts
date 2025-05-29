import { initializeDatabase, AppDataSource } from './config';
import { createUser } from './repositories/UserRepository';
import { saveConsentOption } from './repositories/ConsentRepository';
import { initializeDefaultSettings } from './repositories/SettingsRepository';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';

// Initialize the database and seed with initial data
export const initializeDatabaseAndSeed = async (): Promise<void> => {
  try {
    // Ensure data directory exists
    const dataDir = process.env.DATA_DIR || './data';
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Initialize database connection
    await initializeDatabase();
    
    // Seed admin user if not exists
    const adminEmail = 'admin@example.com';
    const adminUser = await AppDataSource.getRepository('users').findOne({ where: { email: adminEmail } });
    
    if (!adminUser) {
      console.log('Seeding admin user...');
      await createUser({
        email: adminEmail,
        password: 'pharmacy123', // Will be hashed in the repository
        firstName: 'John',
        lastName: 'Smith',
        role: 'admin',
        organizationId: 'org-001',
        organizationName: 'Liverpool Pharmacy'
      });
    }
    
    // Seed default consent options if not exist
    const consentOptions = await AppDataSource.getRepository('consent_options').find();
    
    if (consentOptions.length === 0) {
      console.log('Seeding default consent options...');
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
      
      for (const option of defaultOptions) {
        await saveConsentOption(option);
      }
    }
    
    // Initialize default system settings
    console.log('Initializing default system settings...');
    await initializeDefaultSettings();
    
    console.log('Database initialization and seeding completed successfully');
  } catch (error) {
    console.error('Error initializing database and seeding data:', error);
    throw error;
  }
};
