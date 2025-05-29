import 'reflect-metadata';
import { AppDataSource } from '../src/database/config';

// Setup test database
beforeAll(async () => {
  // Use in-memory database for tests
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

// Clean up after all tests
afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

// Clean up after each test
afterEach(async () => {
  if (AppDataSource.isInitialized) {
    // Clear all tables
    const entities = AppDataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = AppDataSource.getRepository(entity.name);
      await repository.clear();
    }
  }
});

// Mock environment variables for tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRY = '1h';
process.env.ENABLE_EMAIL_NOTIFICATIONS = 'false';
process.env.ENABLE_REAL_TIME_UPDATES = 'false';
process.env.LOG_LEVEL = 'error';

// Suppress console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
