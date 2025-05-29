import { Router } from 'express';
import * as AdminController from '../controllers/auth.controller';
import * as SettingsController from '../controllers/settings.controller';
import * as AuditController from '../controllers/audit.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { validate, schemas } from '../services/validation.service';
import { asyncHandler } from '../middleware/error.middleware';

const router = Router();

// Authentication
router.post('/login',
  validate(schemas.adminLogin, 'body'),
  asyncHandler(AdminController.login)
);
router.post('/validate-token',
  authenticateJWT,
  asyncHandler(AdminController.validateToken)
);

// Settings endpoints
router.get('/settings',
  authenticateJWT,
  asyncHandler(SettingsController.getSettings)
);
router.put('/settings/general',
  authenticateJWT,
  validate(schemas.systemSettings, 'body'),
  asyncHandler(SettingsController.updateGeneralSettings)
);
router.put('/settings/notifications',
  authenticateJWT,
  asyncHandler(SettingsController.updateNotificationSettings)
);
router.get('/settings/consent-options',
  authenticateJWT,
  asyncHandler(SettingsController.getConsentOptions)
);
router.put('/settings/consent-options',
  authenticateJWT,
  asyncHandler(SettingsController.updateConsentOptions)
);
router.post('/settings/consent-options',
  authenticateJWT,
  validate(schemas.consentOption, 'body'),
  asyncHandler(SettingsController.addConsentOption)
);
router.delete('/settings/consent-options/:id',
  authenticateJWT,
  asyncHandler(SettingsController.deleteConsentOption)
);

// Audit logs with pagination and filtering
router.get('/audit-logs',
  authenticateJWT,
  validate(schemas.pagination, 'query'),
  validate(schemas.auditFilters, 'query'),
  asyncHandler(AuditController.getAuditLogs)
);

export default router;