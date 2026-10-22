import { Router } from 'express';
import { listPublicProjects, getPublicProjectBySlug } from '../controllers/publicProject.controller.js';
import { validateQuery } from '../middleware/validate.middleware.js';
import { publicProjectQuerySchema } from '../validations/project.schema.js';

const router = Router();

router.get('/', validateQuery(publicProjectQuerySchema), listPublicProjects);
router.get('/:slug', getPublicProjectBySlug);

export default router;
