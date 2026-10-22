import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler.middleware.js';

export function csrfProtection(req: Request, _res: Response, next: NextFunction): void {
  // Safe HTTP methods do not change server state
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const hasAuthCookie = Boolean(req.cookies?.auth_token);

  // Intentional non-cookie Bearer API access:
  // If the request carries NO ambient auth cookie and explicitly authenticates via Bearer token,
  // ambient browser cookie CSRF does not apply.
  if (!hasAuthCookie && req.headers.authorization?.startsWith('Bearer ')) {
    return next();
  }

  // If an auth_token cookie is present (or any cookie-authenticated request),
  // custom anti-CSRF request headers are strictly required to protect against cross-site requests.
  const requestedWith = req.headers['x-requested-with'];
  const csrfHeader = req.headers['x-csrf-token'];
  const secFetchSite = req.headers['sec-fetch-site'];

  // Legitimate Single Page Application requests provide custom headers (X-Requested-With / X-CSRF-Token)
  // which cross-origin attackers cannot attach without passing browser CORS preflight checks,
  // or browser-verified Sec-Fetch-Site same-origin / same-site headers.
  if (
    requestedWith === 'XMLHttpRequest' ||
    csrfHeader === '1' ||
    (typeof csrfHeader === 'string' && csrfHeader.length > 0) ||
    secFetchSite === 'same-origin' ||
    secFetchSite === 'same-site'
  ) {
    return next();
  }

  throw new AppError(
    403,
    'CSRF validation failed: Missing custom request protection header.',
    'https://api.portfolio.dev/errors/csrf-violation'
  );
}
