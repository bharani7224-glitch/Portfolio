import { Resend } from 'resend';
import { ENV } from '../config/env.js';

let resendClient: Resend | null = null;

export function getResendClient(): Resend | null {
  if (!ENV.RESEND_API_KEY) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(ENV.RESEND_API_KEY);
  }
  return resendClient;
}

export interface SendContactEmailParams {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}

export interface SendContactEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Sends a portfolio contact notification email via Resend.
 * - From: ENV.RESEND_FROM_EMAIL (e.g. 'onboarding@resend.dev' or custom domain)
 * - To: ENV.CONTACT_NOTIFICATION_EMAIL (your admin email)
 * - Reply-To: Visitor's email address (so replying in your mail client goes to them)
 */
export async function sendContactNotification(
  params: SendContactEmailParams
): Promise<SendContactEmailResult> {
  const client = getResendClient();

  if (!client) {
    return {
      success: false,
      error: 'RESEND_API_KEY is not configured on the server.',
    };
  }

  const { senderName, senderEmail, subject, message } = params;

  try {
    const res = await client.emails.send({
      from: `Portfolio Contact <${ENV.RESEND_FROM_EMAIL}>`,
      to: [ENV.CONTACT_NOTIFICATION_EMAIL],
      replyTo: senderEmail,
      subject: `[Portfolio Inquiry] ${subject}`,
      text: `New contact form submission from: ${senderName} (${senderEmail})\n\nSubject: ${subject}\n\nMessage:\n${message}\n\n---\nSent from Portfolio Contact Form`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0ea5e9; margin-top: 0;">New Portfolio Message</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 100px;">From:</td>
              <td style="padding: 8px 0; font-weight: 500;">${escapeHtml(senderName)} &lt;<a href="mailto:${escapeHtml(senderEmail)}" style="color: #0ea5e9;">${escapeHtml(senderEmail)}</a>&gt;</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Subject:</td>
              <td style="padding: 8px 0; font-weight: 500;">${escapeHtml(subject)}</td>
            </tr>
          </table>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-top: 10px; white-space: pre-wrap;">${escapeHtml(message)}</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
            You can reply directly to this email to respond to ${escapeHtml(senderName)}.
          </p>
        </div>
      `,
    });

    if (res.error) {
      return {
        success: false,
        error: res.error.message || 'Resend API returned an error',
      };
    }

    return {
      success: true,
      messageId: res.data?.id,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Unexpected error communicating with email provider',
    };
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
