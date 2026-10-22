import { Router } from 'express';
import {
  listAdminProjects,
  getAdminProjectById,
  createProject,
  updateProject,
  updateProjectStatus,
  deleteProject,
} from '../controllers/adminProject.controller.js';
import { requireAdmin } from '../middleware/auth.middleware.js';
import { csrfProtection } from '../middleware/csrf.middleware.js';
import { adminMutationRateLimiter } from '../middleware/rateLimit.middleware.js';
import { validateBody, validateQuery } from '../middleware/validate.middleware.js';
import {
  createProjectSchema,
  updateProjectSchema,
  projectStatusSchema,
  adminProjectQuerySchema,
} from '../validations/project.schema.js';

const router = Router();

// Protect ALL admin routes with requireAdmin
router.use(requireAdmin);

router.get('/', validateQuery(adminProjectQuerySchema), listAdminProjects);
router.get('/:id', getAdminProjectById);
router.post('/', adminMutationRateLimiter, csrfProtection, validateBody(createProjectSchema), createProject);
router.put('/:id', adminMutationRateLimiter, csrfProtection, validateBody(updateProjectSchema), updateProject);
router.patch('/:id/status', adminMutationRateLimiter, csrfProtection, validateBody(projectStatusSchema), updateProjectStatus);
router.delete('/:id', adminMutationRateLimiter, csrfProtection, deleteProject);

export default router;
