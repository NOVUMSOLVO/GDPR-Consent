import { DataSource } from 'typeorm';
import path from 'path';
import { ConsentRecord } from './entities/ConsentRecord';
import { AuditLog } from './entities/AuditLog';
import { SystemSetting } from './entities/SystemSetting';
import { ConsentOption } from './entities/ConsentOption';
import { User } from './entities/User';

// Database configuration
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.join(process.env.DATA_DIR || './data', 'gdpr-consent.sqlite'),
  entities: [ConsentRecord, AuditLog, SystemSetting, ConsentOption, User],
  synchronize: true, // Set to false in production and use migrations
  logging: process.env.NODE_ENV === 'development',
});

// Initialize database connection
export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');
  } catch (error) {
    console.error('Error initializing database connection:', error);
    throw error;
  }
};
