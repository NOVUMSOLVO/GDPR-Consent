import request from 'supertest';
import express from 'express';
import { saveUserConsent, getUserConsent, getDefaultConsentOptions } from '../../src/controllers/consent.controller';

const app = express();
app.use(express.json());
app.post('/api/consent', saveUserConsent);
app.get('/api/consent/defaults', getDefaultConsentOptions);
app.get('/api/consent/:email', getUserConsent);

describe('Consent Controller', () => {
  describe('POST /consent', () => {
    it('should save user consent successfully', async () => {
      const consentData = {
        name: 'John Doe',
        email: 'john@example.com',
        consentOptions: [
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
        ],
      };

      const response = await request(app)
        .post('/api/consent')
        .send(consentData)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(consentData.email);
      expect(response.body.name).toBe(consentData.name);
      expect(response.body.consentOptions).toHaveLength(2);
    });

    it('should return 400 for invalid consent data', async () => {
      const invalidData = {
        name: '',
        email: 'invalid-email',
        consentOptions: [],
      };

      await request(app)
        .post('/api/consent')
        .send(invalidData)
        .expect(400);
    });
  });

  describe('GET /consent/:email', () => {
    it('should retrieve user consent by email', async () => {
      // First, save a consent record
      const consentData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        consentOptions: [
          {
            id: 'necessary',
            title: 'Necessary Cookies',
            description: 'Required for basic functionality',
            required: true,
            checked: true,
          },
        ],
      };

      await request(app)
        .post('/api/consent')
        .send(consentData);

      // Then retrieve it
      const response = await request(app)
        .get('/api/consent/jane@example.com')
        .expect(200);

      expect(response.body.email).toBe('jane@example.com');
      expect(response.body.name).toBe('Jane Doe');
    });

    it('should return 404 for non-existent email', async () => {
      await request(app)
        .get('/api/consent/nonexistent@example.com')
        .expect(404);
    });
  });

  describe('GET /consent/defaults', () => {
    it('should return default consent options', async () => {
      const response = await request(app)
        .get('/api/consent/defaults')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Check that each option has required fields
      response.body.forEach((option: any) => {
        expect(option).toHaveProperty('id');
        expect(option).toHaveProperty('title');
        expect(option).toHaveProperty('description');
        expect(option).toHaveProperty('required');
        expect(option).toHaveProperty('checked');
      });
    });
  });
});
