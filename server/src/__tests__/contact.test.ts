import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { ContactMessage } from '../models/ContactMessage.js';
import * as emailService from '../services/email.service.js';

describe('Contact Submission API (/api/v1/contact)', () => {
  beforeEach(async () => {
    // Clear contact messages collection for clean test isolation
    await ContactMessage.deleteMany({});
    vi.restoreAllMocks();
  });

  const validPayload = {
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Website Project Collaboration',
    message: 'Hello Bharani, I would like to discuss building an enterprise application together.',
  };

  it('successfully persists message to MongoDB and returns 201 when Resend delivery succeeds', async () => {
    // Mock Resend delivery success
    vi.spyOn(emailService, 'sendContactNotification').mockResolvedValueOnce({
      success: true,
      messageId: 'resend_msg_test_12345',
    });

    const res = await request(app)
      .post('/api/v1/contact')
      .send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('received and delivered');
    expect(res.body.delivery?.status).toBe('sent');
    expect(res.body.id).toBeDefined();

    // Verify persisted record in MongoDB
    const saved = await ContactMessage.findById(res.body.id);
    expect(saved).toBeDefined();
    expect(saved!.name).toBe(validPayload.name);
    expect(saved!.email).toBe(validPayload.email);
    expect(saved!.subject).toBe(validPayload.subject);
    expect(saved!.message).toBe(validPayload.message);
    expect(saved!.deliveryStatus).toBe('sent');
    expect(saved!.providerMessageId).toBe('resend_msg_test_12345');
    expect(saved!.deliveryError).toBeUndefined();
  });

  it('persists message to MongoDB and returns 202 accepted when Resend delivery fails', async () => {
    // Mock Resend delivery failure (e.g. unverified domain or API quota)
    vi.spyOn(emailService, 'sendContactNotification').mockResolvedValueOnce({
      success: false,
      error: 'Resend API key missing or invalid domain',
    });

    const res = await request(app)
      .post('/api/v1/contact')
      .send(validPayload);

    expect(res.status).toBe(202);
    expect(res.body.success).toBe(true);
    expect(res.body.delivery?.status).toBe('pending');
    expect(res.body.id).toBeDefined();

    // Verify record is STILL securely kept in MongoDB
    const saved = await ContactMessage.findById(res.body.id);
    expect(saved).toBeDefined();
    expect(saved!.deliveryStatus).toBe('failed');
    expect(saved!.deliveryError).toContain('Resend API key missing');
  });

  it('rejects invalid email address with RFC 9457 400 validation error', async () => {
    const res = await request(app)
      .post('/api/v1/contact')
      .send({
        ...validPayload,
        email: 'invalid-email-address',
      });

    expect(res.status).toBe(400);
    expect(res.body.type).toContain('validation-error');
    expect(res.body.errors?.email).toBeDefined();

    // Confirm no message was persisted
    const count = await ContactMessage.countDocuments();
    expect(count).toBe(0);
  });

  it('rejects message shorter than 10 characters', async () => {
    const res = await request(app)
      .post('/api/v1/contact')
      .send({
        ...validPayload,
        message: 'Short',
      });

    expect(res.status).toBe(400);
    expect(res.body.type).toContain('validation-error');
    expect(res.body.errors?.message).toBeDefined();
  });

  it('rejects empty or whitespace-only name and subject', async () => {
    const res = await request(app)
      .post('/api/v1/contact')
      .send({
        ...validPayload,
        name: '   ',
        subject: '',
      });

    expect(res.status).toBe(400);
    expect(res.body.errors?.name).toBeDefined();
    expect(res.body.errors?.subject).toBeDefined();
  });

  it('rejects unexpected properties with strict schema validation', async () => {
    const res = await request(app)
      .post('/api/v1/contact')
      .send({
        ...validPayload,
        maliciousExtraField: 'exploit_attempt',
      });

    expect(res.status).toBe(400);
    expect(res.body.type).toContain('validation-error');
  });

  it('enforces rate limiting on contact form submissions', async () => {
    process.env.TEST_RATE_LIMIT = 'true';
    process.env.CONTACT_RATE_LIMIT = '2';

    vi.spyOn(emailService, 'sendContactNotification').mockResolvedValue({
      success: true,
      messageId: 'mock_rate_msg',
    });

    try {
      const r1 = await request(app).post('/api/v1/contact').send(validPayload);
      const r2 = await request(app).post('/api/v1/contact').send(validPayload);
      const r3 = await request(app).post('/api/v1/contact').send(validPayload);

      expect(r1.status).toBe(201);
      expect(r2.status).toBe(201);
      expect(r3.status).toBe(429);
      expect(r3.body.title).toBe('Too Many Requests');
      expect(r3.body.detail).toContain('Too many contact messages');
    } finally {
      delete process.env.TEST_RATE_LIMIT;
      delete process.env.CONTACT_RATE_LIMIT;
    }
  });
});
