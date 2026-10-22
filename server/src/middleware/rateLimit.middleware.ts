import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: () => parseInt(process.env.LOGIN_RATE_LIMIT || '10', 10),
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test' && !process.env.TEST_RATE_LIMIT,
  message: {
    type: 'https://api.portfolio.dev/errors/rate-limit-exceeded',
    title: 'Too Many Requests',
    status: 429,
    detail: 'Too many login attempts. Please try again after 15 minutes.',
  },
});

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: () => parseInt(process.env.API_RATE_LIMIT || '180', 10),
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test' && !process.env.TEST_RATE_LIMIT,
  message: {
    type: 'https://api.portfolio.dev/errors/rate-limit-exceeded',
    title: 'Too Many Requests',
    status: 429,
    detail: 'Rate limit exceeded. Please slow down your requests.',
  },
});

/**
 * Admin Mutation Rate Limiter
 * Applied to state-changing operations (POST, PUT, PATCH, DELETE) in the Admin CMS.
 * Default: 60 requests per 15 minutes per IP (configurable via ADMIN_MUTATION_RATE_LIMIT).
 */
export const adminMutationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: () => parseInt(process.env.ADMIN_MUTATION_RATE_LIMIT || '60', 10),
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test' && !process.env.TEST_RATE_LIMIT,
  message: {
    type: 'https://api.portfolio.dev/errors/rate-limit-exceeded',
    title: 'Too Many Requests',
    status: 429,
    detail: 'Too many administrative modifications submitted. Please wait before trying again.',
  },
});
