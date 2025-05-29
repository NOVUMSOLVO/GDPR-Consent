import express from 'express';
import { saveUserConsent, getUserConsent, getDefaultConsentOptions } from '../controllers/consent.controller';
import { validate, schemas } from '../services/validation.service';
import { asyncHandler } from '../middleware/error.middleware';

const router = express.Router();

// Get default consent options
router.get('/defaults', asyncHandler(getDefaultConsentOptions));

// Save user consent with validation
router.post('/',
  validate(schemas.userConsent, 'body'),
  asyncHandler(saveUserConsent)
);

// Get user consent by email
router.get('/:email', asyncHandler(getUserConsent));

export default router;