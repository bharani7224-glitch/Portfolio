import dotenv from 'dotenv';
import path from 'path';

// Load .env from server directory or root
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio',
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret_must_be_changed_in_production_32chars!',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_ISSUER: process.env.JWT_ISSUER || 'portfolio-cms',
  JWT_AUDIENCE: process.env.JWT_AUDIENCE || 'portfolio-admin',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@bharani.dev',
  ADMIN_INITIAL_PASSWORD: process.env.ADMIN_INITIAL_PASSWORD || '',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  CONTACT_NOTIFICATION_EMAIL: process.env.CONTACT_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'admin@bharani.dev',
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
};

// Validate critical secrets in production
if (ENV.IS_PRODUCTION) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('CRITICAL: JWT_SECRET must be set and at least 32 characters in production.');
  }
  if (!process.env.MONGODB_URI) {
    throw new Error('CRITICAL: MONGODB_URI must be set in production.');
  }
}
