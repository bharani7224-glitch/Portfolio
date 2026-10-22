import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env.js';
import { apiRateLimiter } from './middleware/rateLimit.middleware.js';
import { errorHandler, AppError } from './middleware/errorHandler.middleware.js';

import authRoutes from './routes/auth.routes.js';
import publicProjectRoutes from './routes/publicProject.routes.js';
import adminProjectRoutes from './routes/adminProject.routes.js';
import healthRoutes from './routes/health.routes.js';
import contactRoutes from './routes/contact.routes.js';

export const app = express();

// Trust reverse proxy (e.g., Render, Nginx) for accurate IP resolution and secure cookie handling in production
if (ENV.IS_PRODUCTION) {
  app.set('trust proxy', 1);
}

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        fontSrc: ["'self'", 'https:', 'data:'],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'"],
        scriptSrcAttr: ["'none'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        upgradeInsecureRequests: ENV.IS_PRODUCTION ? [] : null,
      },
    },
    // Prevent MIME-sniffing
    noSniff: true,
    // Frame protection (Clickjacking)
    frameguard: { action: 'deny' },
    // Enable HSTS in production (only when HTTPS is terminated or active)
    hsts: ENV.IS_PRODUCTION
      ? {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        }
      : false,
  })
);

// Environment-Aware CORS Allowlist
export function getAllowedOrigins(isProduction = ENV.IS_PRODUCTION, frontendOrigin = ENV.FRONTEND_ORIGIN): string[] {
  if (isProduction) {
    return [frontendOrigin].filter(Boolean);
  }
  return [
    frontendOrigin,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
  ].filter(Boolean);
}

const allowedOrigins = getAllowedOrigins();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(
        new AppError(
          403,
          `Origin '${origin}' is not allowed by CORS.`,
          'https://api.portfolio.dev/errors/cors-forbidden'
        )
      );
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
  })
);

// Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// General API rate limiter
app.use('/api/', apiRateLimiter);

// Routes
app.use('/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', publicProjectRoutes);
app.use('/api/v1/admin/projects', adminProjectRoutes);
app.use('/api/v1/contact', contactRoutes);

// 404 Route Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    type: 'https://api.portfolio.dev/errors/not-found',
    title: 'Resource Not Found',
    status: 404,
    detail: `Route ${req.method} ${req.originalUrl} does not exist.`,
    instance: req.originalUrl,
  });
});

// Centralized RFC 9457 Error Handler
app.use(errorHandler);
