import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { app } from '../app.js';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';

describe('Projects CMS & Public APIs', () => {
  let authCookie: string[];

  beforeEach(async () => {
    // Setup admin user
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('TestAdminPass123!', salt);
    await User.create({
      email: 'admin@bharani.dev',
      passwordHash,
      role: 'admin',
    });

    // Login to obtain cookie
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@bharani.dev',
        password: 'TestAdminPass123!',
      });

    authCookie = loginRes.headers['set-cookie'];
  });

  describe('Admin Authorization', () => {
    it('blocks unauthenticated access to admin project endpoints', async () => {
      const res = await request(app).get('/api/v1/admin/projects');
      expect(res.status).toBe(401);
      expect(res.body.type).toContain('unauthorized');
    });

    it('blocks unauthenticated project creation', async () => {
      const res = await request(app)
        .post('/api/v1/admin/projects')
        .send({ title: 'Test Project' });
      expect(res.status).toBe(401);
    });
  });

  describe('Project Creation & Validation', () => {
    it('creates a draft project with valid inputs', async () => {
      const payload = {
        title: 'Ledze Plus ERP',
        slug: 'ledze-plus-erp',
        shortDescription: 'Enterprise ERP application with workflows',
        description: 'Comprehensive ERP solution with department authorization hierarchies and invoice flows.',
        technologies: ['C#', 'ASP.NET Core', 'PostgreSQL', 'React.js'],
        category: 'fullstack',
        featured: true,
        displayOrder: 1,
        status: 'draft',
      };

      const res = await request(app)
        .post('/api/v1/admin/projects')
        .set('Cookie', authCookie)
        .set('X-Requested-With', 'XMLHttpRequest')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe('ledze-plus-erp');
      expect(res.body.data.status).toBe('draft');
      expect(res.body.data.technologies).toHaveLength(4);
    });

    it('rejects duplicate slugs with 409 Conflict', async () => {
      const payload = {
        title: 'First Project',
        slug: 'unique-project-slug',
        shortDescription: 'First project short description',
        description: 'Detailed description for first project.',
        technologies: ['React'],
        status: 'published',
      };

      // Create first
      const first = await request(app)
        .post('/api/v1/admin/projects')
        .set('Cookie', authCookie)
        .set('X-Requested-With', 'XMLHttpRequest')
        .send(payload);
      expect(first.status).toBe(201);

      // Attempt duplicate slug
      const second = await request(app)
        .post('/api/v1/admin/projects')
        .set('Cookie', authCookie)
        .set('X-Requested-With', 'XMLHttpRequest')
        .send({
          ...payload,
          title: 'Different Title With Same Slug',
        });

      expect(second.status).toBe(409);
      expect(second.body.type).toContain('duplicate-slug');
      expect(second.body.errors.slug).toBeDefined();
    });

    it('validates required fields and rejects invalid slugs/URLs', async () => {
      const res = await request(app)
        .post('/api/v1/admin/projects')
        .set('Cookie', authCookie)
        .set('X-Requested-With', 'XMLHttpRequest')
        .send({
          title: '',
          slug: 'Invalid Slug with Spaces!',
          shortDescription: 'short',
          description: '',
          technologies: [],
          liveDemoUrl: 'not-a-valid-url',
        });

      expect(res.status).toBe(400);
      expect(res.body.type).toContain('validation-error');
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('Draft Isolation & Public Project Endpoints', () => {
    beforeEach(async () => {
      // Create 1 published project and 1 draft project
      await Project.create({
        title: 'Published System',
        slug: 'published-system',
        shortDescription: 'This is visible to public visitors',
        description: 'Detailed description of published system.',
        technologies: ['C#', 'PostgreSQL'],
        category: 'systems',
        featured: true,
        displayOrder: 1,
        status: 'published',
      });

      await Project.create({
        title: 'Secret Internal Draft',
        slug: 'secret-draft',
        shortDescription: 'This should NEVER appear in public APIs',
        description: 'Confidential system details.',
        technologies: ['Node.js'],
        category: 'systems',
        featured: false,
        displayOrder: 2,
        status: 'draft',
      });
    });

    it('GET /api/v1/projects returns published projects ONLY (drafts are isolated)', async () => {
      const res = await request(app).get('/api/v1/projects');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].slug).toBe('published-system');
      expect(res.body.pagination.total).toBe(1);

      // Verify draft is completely omitted
      const slugs = res.body.data.map((p: any) => p.slug);
      expect(slugs).not.toContain('secret-draft');
    });

    it('GET /api/v1/projects/:slug returns 404 for draft projects', async () => {
      // Trying to access draft directly via public slug endpoint
      const res = await request(app).get('/api/v1/projects/secret-draft');
      expect(res.status).toBe(404);
      expect(res.body.type).toContain('not-found');
    });

    it('GET /api/v1/projects/:slug returns 200 for published projects', async () => {
      const res = await request(app).get('/api/v1/projects/published-system');
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Published System');
    });

    it('GET /api/v1/admin/projects returns BOTH draft and published projects', async () => {
      const res = await request(app)
        .get('/api/v1/admin/projects')
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.counts.published).toBe(1);
      expect(res.body.counts.draft).toBe(1);
    });
  });

  describe('Update, Status Toggle & Delete', () => {
    let projectId: string;

    beforeEach(async () => {
      const project = await Project.create({
        title: 'Transport Logistics Hub',
        slug: 'transport-logistics-hub',
        shortDescription: 'Logistics tracking software',
        description: 'Detailed logistics tracking software description.',
        technologies: ['React', 'ASP.NET'],
        category: 'fullstack',
        status: 'draft',
      });
      projectId = project._id.toString();
    });

    it('updates project content', async () => {
      const res = await request(app)
        .put(`/api/v1/admin/projects/${projectId}`)
        .set('Cookie', authCookie)
        .set('X-Requested-With', 'XMLHttpRequest')
        .send({
          title: 'Transport Logistics Hub (Updated)',
          technologies: ['React', 'ASP.NET Core', 'Docker'],
        });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Transport Logistics Hub (Updated)');
      expect(res.body.data.technologies).toContain('Docker');
    });

    it('toggles project status to published via PATCH', async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/projects/${projectId}/status`)
        .set('Cookie', authCookie)
        .set('X-Requested-With', 'XMLHttpRequest')
        .send({ status: 'published' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('published');

      // Now verify it shows up on public endpoint
      const pubRes = await request(app).get('/api/v1/projects');
      expect(pubRes.body.data.some((p: any) => p.id === projectId)).toBe(true);
    });

    it('deletes project after confirmation', async () => {
      const res = await request(app)
        .delete(`/api/v1/admin/projects/${projectId}`)
        .set('Cookie', authCookie)
        .set('X-Requested-With', 'XMLHttpRequest');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify gone from DB
      const check = await Project.findById(projectId);
      expect(check).toBeNull();
    });

    it('returns 400 for invalid ObjectId format', async () => {
      const res = await request(app)
        .get('/api/v1/admin/projects/not-a-valid-id')
        .set('Cookie', authCookie);

      expect(res.status).toBe(400);
      expect(res.body.type).toContain('invalid-id');
    });
  });
});
