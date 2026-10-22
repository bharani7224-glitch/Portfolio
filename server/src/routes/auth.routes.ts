import { Router } from 'express';
import { login, logout, getMe } from '../controllers/auth.controller.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { loginSchema } from '../validations/auth.schema.js';
import { loginRateLimiter } from '../middleware/rateLimit.middleware.js';
import { requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', loginRateLimiter, validateBody(loginSchema), login);
router.post('/logout', logout);
router.get('/me', requireAdmin, getMe);

export default router;
