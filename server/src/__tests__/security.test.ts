import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { app, getAllowedOrigins } from '../app.js';
import { User } from '../models/User.js';
import { ENV } from '../config/env.js';
import { seedAdmin } from '../scripts/seedAdmin.js';

describe('Phase 1 Security Controls Audit & Regressions', () => {
  const adminEmail = 'admin@bharani.dev';
  const originalPassword = 'OriginalSecretPassword123!';
  let authCookie: string[];
  let validJwtToken: string;

  beforeEach(async () => {
    // Clear users collection for a clean, deterministic state
    await User.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(originalPassword, salt);
    const user = await User.create({
      email: adminEmail,
      passwordHash,
      role: 'admin',
    });

    validJwtToken = jwt.sign(
      { sub: user._id.toString(), email: user.email, role: user.role },
      ENV.JWT_SECRET,
      { expiresIn: '1h', issuer: ENV.JWT_ISSUER, audience: ENV.JWT_AUDIENCE }
    );

    // Obtain real session cookie
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: adminEmail, password: originalPassword });

    authCookie = loginRes.headers['set-cookie'];
  });

  describe('FIX 1 & FIX 3: Admin Seed Idempotency & Insecure Password Fallback', () => {
    it('seedAdmin is idempotent: does NOT overwrite existing admin passwordHash', async () => {
      const userBefore = await User.findOne({ email: adminEmail });
      expect(userBefore).toBeDefined();
      const originalHash = userBefore!.passwordHash;

      // Attempt to run seedAdmin with a different password
      process.env.ADMIN_EMAIL = adminEmail;
      process.env.ADMIN_INITIAL_PASSWORD = 'CompletelyNewAttemptedPassword999!';

      const result = await seedAdmin();

      expect(result.status).toBe('skipped');
      expect(result.message).toContain('already exists');

      // Verify that the passwordHash in database was NOT changed
      const userAfter = await User.findOne({ email: adminEmail });
      expect(userAfter!.passwordHash).toBe(originalHash);

      // Verify original password still compares successfully
      const comparesOriginal = await bcrypt.compare(originalPassword, userAfter!.passwordHash);
      expect(comparesOriginal).toBe(true);

      // Verify new attempted password cannot log in
      const comparesNew = await bcrypt.compare('CompletelyNewAttemptedPassword999!', userAfter!.passwordHash);
      expect(comparesNew).toBe(false);
    });

    it('seedAdmin fails safely without creating an account if password is empty or too short', async () => {
      // Remove all users to test initial provisioning
      await User.deleteMany({});

      process.env.ADMIN_EMAIL = 'newadmin@bharani.dev';
      process.env.ADMIN_INITIAL_PASSWORD = '';

      const result = await seedAdmin();
      expect(result.status).toBe('failed');
      expect(result.message).toContain('ADMIN_INITIAL_PASSWORD must be explicitly configured');

      const count = await User.countDocuments();
      expect(count).toBe(0);
    });

    it('seedAdmin creates admin when account does not exist and strong password is provided', async () => {
      await User.deleteMany({});

      process.env.ADMIN_EMAIL = 'brandnew@bharani.dev';
      process.env.ADMIN_INITIAL_PASSWORD = 'BrandNewStrongPass123!';

      const result = await seedAdmin();
      expect(result.status).toBe('created');

      const created = await User.findOne({ email: 'brandnew@bharani.dev' });
      expect(created).toBeDefined();
      expect(await bcrypt.compare('BrandNewStrongPass123!', created!.passwordHash)).toBe(true);
    });
  });

  describe('FIX 2: CSRF Bypass Prevention', () => {
    const validProjectPayload = {
      title: 'Security Audited Project',
      slug: 'security-audited-project',
      shortDescription: 'Project used to test CSRF regressions',
      description: 'Comprehensive detailed technical description.',
      technologies: ['Node.js', 'Express', 'TypeScript'],
      status: 'draft',
    };

    it('REJECTS cookie-authenticated request when dummy Bearer header is added without CSRF header (Bypass Prevention)', async () => {
      const res = await request(app)
        .post('/api/v1/admin/projects')
        .set('Cookie', authCookie)
        .set('Authorization', 'Bearer dummy_unauthorized_token')
        // Intentionally omitting X-Requested-With and X-CSRF-Token
        .send(validProjectPayload);

      expect(res.status).toBe(403);
      expect(res.body.type).toContain('csrf-violation');
      expect(res.body.detail).toContain('CSRF validation failed');
    });

    it('REJECTS cookie-authenticated request when anti-CSRF headers are omitted', async () => {
      const res = await request(app)
        .post('/api/v1/admin/projects')
        .set('Cookie', authCookie)
        // Intentionally omitting X-Requested-With and X-CSRF-Token
        .send(validProjectPayload);

      expect(res.status).toBe(403);
      expect(res.body.type).toContain('csrf-violation');
    });

    it('ACCEPTS cookie-authenticated request when X-Requested-With header is present', async () => {
      const res = await request(app)
        .post('/api/v1/admin/projects')
        .set('Cookie', authCookie)
        .set('X-Requested-With', 'XMLHttpRequest')
        .send(validProjectPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe('security-audited-project');
    });

    it('ACCEPTS cookie-authenticated request when X-CSRF-Token header is present', async () => {
      const res = await request(app)
        .post('/api/v1/admin/projects')
        .set('Cookie', authCookie)
        .set('X-CSRF-Token', '1')
        .send({
          ...validProjectPayload,
          title: 'Another CSRF Project',
          slug: 'another-csrf-project',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('ACCEPTS legitimate API request authenticated via Bearer token without cookie and without CSRF headers', async () => {
      const res = await request(app)
        .post('/api/v1/admin/projects')
        // No Cookie header
        .set('Authorization', `Bearer ${validJwtToken}`)
        // No CSRF headers
        .send({
          ...validProjectPayload,
          title: 'Bearer API Project',
          slug: 'bearer-api-project',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe('FIX 4: Environment-Aware CORS', () => {
    it('restricts allowed origins strictly to production frontend in production mode', () => {
      const prodOrigins = getAllowedOrigins(true, 'https://bharani.dev');
      expect(prodOrigins).toEqual(['https://bharani.dev']);
      expect(prodOrigins).not.toContain('http://localhost:5173');
      expect(prodOrigins).not.toContain('http://localhost:3000');
    });

    it('includes localhost origins in non-production mode for local development', () => {
      const devOrigins = getAllowedOrigins(false, 'http://localhost:5173');
      expect(devOrigins).toContain('http://localhost:5173');
      expect(devOrigins).toContain('http://127.0.0.1:5173');
      expect(devOrigins).toContain('http://localhost:3000');
    });

    it('rejects cross-origin requests from untrusted origins with 403 Problem Details', async () => {
      const res = await request(app)
        .get('/api/v1/projects')
        .set('Origin', 'https://malicious-attacker-website.com');

      expect(res.status).toBe(403);
      expect(res.body.type).toContain('cors-forbidden');
      expect(res.body.detail).toContain('not allowed by CORS');
    });
  });

  describe('PHASE 2: HTTP Security Headers, Token Revocation & Rate Limiting', () => {
    it('serves Helmet security headers including X-Content-Type-Options and Frameguard', async () => {
      const res = await request(app).get('/health');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBe('DENY');
      expect(res.headers['content-security-policy']).toBeDefined();
    });

    it('revokes server-side session when user logs out (tokenVersion invalidation)', async () => {
      // 1. Verify user can access /api/v1/auth/me with authCookie
      const meResBefore = await request(app)
        .get('/api/v1/auth/me')
        .set('Cookie', authCookie);
      expect(meResBefore.status).toBe(200);

      // 2. Perform logout with authCookie
      const logoutRes = await request(app)
        .post('/api/v1/auth/logout')
        .set('Cookie', authCookie);
      expect(logoutRes.status).toBe(200);

      // 3. Verify that the previous authCookie is now REJECTED with 401 token-revoked
      const meResAfter = await request(app)
        .get('/api/v1/auth/me')
        .set('Cookie', authCookie);
      expect(meResAfter.status).toBe(401);
      expect(meResAfter.body.type).toContain('token-revoked');
    });

    it('enforces rate limiting when enabled and returns RFC 9457 429 response', async () => {
      // Temporarily enable rate limiting for this test
      process.env.TEST_RATE_LIMIT = 'true';
      process.env.LOGIN_RATE_LIMIT = '3';

      try {
        // Send requests until limit is exceeded
        const r1 = await request(app).post('/api/v1/auth/login').send({ email: 'fake@bharani.dev', password: 'pwd' });
        const r2 = await request(app).post('/api/v1/auth/login').send({ email: 'fake@bharani.dev', password: 'pwd' });
        const r3 = await request(app).post('/api/v1/auth/login').send({ email: 'fake@bharani.dev', password: 'pwd' });
        const r4 = await request(app).post('/api/v1/auth/login').send({ email: 'fake@bharani.dev', password: 'pwd' });

        expect(r4.status).toBe(429);
        expect(r4.body.status).toBe(429);
        expect(r4.body.title).toBe('Too Many Requests');
        expect(r4.body.detail).toContain('Too many login attempts');
      } finally {
        delete process.env.TEST_RATE_LIMIT;
        delete process.env.LOGIN_RATE_LIMIT;
      }
    });

    it('verifies trust proxy configuration aligns with production topology', () => {
      // In non-production test environment, trust proxy should not be enabled by default
      if (!ENV.IS_PRODUCTION) {
        expect(app.get('trust proxy')).toBeFalsy();
      }
    });
  });
});
