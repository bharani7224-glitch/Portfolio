import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { AppError } from './errorHandler.middleware.js';
import { User } from '../models/User.js';

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function requireAdmin(req: Request, _res: Response, next: NextFunction): Promise<void> {
  // Extract token from HTTP-only cookie or Authorization header
  let token = req.cookies?.auth_token;

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.substring(7).trim();
  }

  if (!token) {
    return next(
      new AppError(
        401,
        'Authentication required. Please log in to access this resource.',
        'https://api.portfolio.dev/errors/unauthorized'
      )
    );
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: ENV.JWT_ISSUER,
      audience: ENV.JWT_AUDIENCE,
    }) as { sub: string; email: string; role: 'admin'; tokenVersion?: number };

    if (!decoded.sub || decoded.role !== 'admin') {
      throw new AppError(
        403,
        'Access forbidden. Administrator privileges required.',
        'https://api.portfolio.dev/errors/forbidden'
      );
    }

    // Verify token version against current user state in database
    const dbUser = await User.findById(decoded.sub).select('+tokenVersion');

    if (!dbUser) {
      throw new AppError(
        401,
        'User account no longer exists.',
        'https://api.portfolio.dev/errors/invalid-token'
      );
    }

    // Backward-compatible revocation check:
    // If the token carries a tokenVersion, it must match or exceed the user's current tokenVersion.
    // If the token lacks tokenVersion (issued prior to versioning), treat it as 0.
    const tokenVersion = decoded.tokenVersion ?? 0;
    const currentVersion = dbUser.tokenVersion ?? 0;

    if (tokenVersion < currentVersion) {
      throw new AppError(
        401,
        'Your session has been revoked or logged out. Please log in again.',
        'https://api.portfolio.dev/errors/token-revoked'
      );
    }

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err: any) {
    if (err instanceof AppError) {
      return next(err);
    }
    if (err.name === 'TokenExpiredError') {
      return next(
        new AppError(
          401,
          'Your session has expired. Please log in again.',
          'https://api.portfolio.dev/errors/token-expired'
        )
      );
    }
    return next(
      new AppError(
        401,
        'Invalid authentication credentials.',
        'https://api.portfolio.dev/errors/invalid-token'
      )
    );
  }
}
