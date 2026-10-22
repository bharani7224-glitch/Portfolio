import { z } from 'zod';

const urlOrEmpty = z.string().trim().refine(
  (val) => {
    if (!val) return true;
    try {
      const url = new URL(val);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  },
  { message: 'Must be a valid HTTP or HTTPS URL' }
);

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters')
    .max(150, 'Title cannot exceed 150 characters'),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, 'Slug must be at least 2 characters')
    .max(160, 'Slug cannot exceed 160 characters')
    .regex(slugRegex, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  shortDescription: z
    .string()
    .trim()
    .min(5, 'Short description must be at least 5 characters')
    .max(300, 'Short description cannot exceed 300 characters'),
  description: z
    .string()
    .trim()
    .min(10, 'Detailed description must be at least 10 characters')
    .max(5000, 'Detailed description cannot exceed 5000 characters'),
  technologies: z
    .array(z.string().trim().min(1, 'Tech tag cannot be empty'))
    .min(1, 'At least one technology is required')
    .transform((tags) => Array.from(new Set(tags))),
  thumbnailUrl: urlOrEmpty.optional().default(''),
  githubUrl: urlOrEmpty.optional().default(''),
  liveDemoUrl: urlOrEmpty.optional().default(''),
  category: z.string().trim().max(50).optional().default('fullstack'),
  featured: z.boolean().optional().default(false),
  displayOrder: z.coerce.number().int().min(0).optional().default(0),
  status: z.enum(['draft', 'published']).optional().default('draft'),
});

export const updateProjectSchema = createProjectSchema.partial();

export const projectStatusSchema = z.object({
  status: z.enum(['draft', 'published']),
});

export const publicProjectQuerySchema = z.object({
  category: z.string().trim().optional(),
  tag: z.string().trim().optional(),
  featured: z
    .string()
    .optional()
    .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined)),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(50).optional().default(12),
});

export const adminProjectQuerySchema = z.object({
  status: z.enum(['all', 'draft', 'published']).optional().default('all'),
  category: z.string().trim().optional(),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
