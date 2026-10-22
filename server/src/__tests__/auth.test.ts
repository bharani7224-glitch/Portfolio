import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { app } from '../app.js';
import { User } from '../models/User.js';

describe('Admin Authentication API', () => {
  const adminEmail = 'admin@bharani.dev';
  const adminPassword = 'SuperSecretPassword123!';

  beforeEach(async () => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);
    await User.create({
      email: adminEmail,
      passwordHash,
      role: 'admin',
    });
  });

  it('successfully logs in with valid credentials and sets HTTP-only cookie', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: adminEmail,
        password: adminPassword,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(adminEmail);
    expect(res.body.user.passwordHash).toBeUndefined();

    // Check Set-Cookie header
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some((c: string) => c.includes('auth_token='))).toBe(true);
    expect(cookies.some((c: string) => c.includes('HttpOnly'))).toBe(true);
  });

  it('rejects invalid password with generic 401 error', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: adminEmail,
        password: 'WrongPassword123!',
      });

    expect(res.status).toBe(401);
    expect(res.body.detail).toBe('Invalid email or password.');
    expect(res.headers['set-cookie']).toBeUndefined();
  });

  it('rejects non-existent email with same generic 401 error', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'doesnotexist@bharani.dev',
        password: 'SomePassword123!',
      });

    expect(res.status).toBe(401);
    expect(res.body.detail).toBe('Invalid email or password.');
  });

  it('validates required fields on login payload', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'notanemail',
      });

    expect(res.status).toBe(400);
    expect(res.body.type).toContain('validation-error');
  });

  it('fetches current user via /api/v1/auth/me when authenticated with cookie', async () => {
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: adminEmail,
        password: adminPassword,
      });

    const cookie = loginRes.headers['set-cookie'];

    const meRes = await request(app)
      .get('/api/v1/auth/me')
      .set('Cookie', cookie);

    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe(adminEmail);
    expect(meRes.body.user.role).toBe('admin');
  });

  it('rejects /api/v1/auth/me when not authenticated', async () => {
    const res = await request(app).get('/api/v1/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.detail).toContain('Authentication required');
  });

  it('clears auth cookie on logout', async () => {
    const res = await request(app).post('/api/v1/auth/logout');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    // Cookie should be expired or empty
    expect(cookies.some((c: string) => c.includes('auth_token=;') || c.includes('Expires='))).toBe(true);
  });
});
