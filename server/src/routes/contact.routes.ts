import { Router } from 'express';
import { submitContactMessage } from '../controllers/contact.controller.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { contactSubmissionSchema } from '../validations/contact.schema.js';
import { contactRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

// POST /api/v1/contact
// Rate limited (5 req/15min) + schema validated
router.post(
  '/',
  contactRateLimiter,
  validateBody(contactSubmissionSchema),
  submitContactMessage
);

export default router;
