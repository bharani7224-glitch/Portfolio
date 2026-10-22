import { z } from 'zod';

export const contactSubmissionSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(1, 'Name is required')
      .max(100, 'Name cannot exceed 100 characters'),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Enter a valid email address')
      .max(255, 'Email cannot exceed 255 characters'),
    subject: z
      .string({ required_error: 'Subject is required' })
      .trim()
      .min(1, 'Subject is required')
      .max(200, 'Subject cannot exceed 200 characters'),
    message: z
      .string({ required_error: 'Message is required' })
      .trim()
      .min(10, 'Message must be at least 10 characters')
      .max(5000, 'Message cannot exceed 5000 characters'),
  })
  .strict(); // Reject unexpected properties

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;
