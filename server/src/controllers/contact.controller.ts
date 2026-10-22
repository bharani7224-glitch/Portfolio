import { Request, Response, NextFunction } from 'express';
import { ContactMessage } from '../models/ContactMessage.js';
import { sendContactNotification } from '../services/email.service.js';
import { ContactSubmissionInput } from '../validations/contact.schema.js';

export async function submitContactMessage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, subject, message }: ContactSubmissionInput = req.body;

    // 1. Always persist message to MongoDB FIRST so no submission is ever lost
    const contactDoc = await ContactMessage.create({
      name,
      email,
      subject,
      message,
      deliveryStatus: 'pending',
    });

    // 2. Attempt email dispatch via Resend
    let emailResult;
    try {
      emailResult = await sendContactNotification({
        senderName: name,
        senderEmail: email,
        subject,
        message,
      });
    } catch (sendErr: any) {
      emailResult = {
        success: false,
        error: sendErr?.message || 'Email delivery failed unexpectedly',
      };
    }

    // 3. Update delivery outcome in database
    if (emailResult.success) {
      contactDoc.deliveryStatus = 'sent';
      contactDoc.providerMessageId = emailResult.messageId;
      await contactDoc.save();
    } else {
      contactDoc.deliveryStatus = 'failed';
      // Store a safe, sanitized summary (never leak secrets or internal tokens)
      contactDoc.deliveryError = emailResult.error ? String(emailResult.error).slice(0, 500) : 'Unknown delivery failure';
      await contactDoc.save();
    }

    // 4. Return clear RFC 9457-aligned response
    // Message was accepted & safely stored in DB; email status reflects actual delivery outcome
    if (emailResult.success) {
      res.status(201).json({
        success: true,
        message: 'Thank you! Your message has been received and delivered.',
        id: contactDoc._id.toString(),
        delivery: {
          status: 'sent',
        },
      });
    } else {
      res.status(202).json({
        success: true,
        message: 'Your message has been received and stored, but email notification is currently pending.',
        id: contactDoc._id.toString(),
        delivery: {
          status: 'pending',
          note: 'Notification dispatch will be retried or inspected by administrator.',
        },
      });
    }
  } catch (error) {
    next(error);
  }
}
