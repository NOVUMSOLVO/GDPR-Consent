import nodemailer from 'nodemailer';
import { logInfo, logError } from './logger.service';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface ConsentChangeNotification {
  userEmail: string;
  userName: string;
  changes: Array<{
    option: string;
    previousValue: boolean;
    newValue: boolean;
  }>;
  timestamp: Date;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true';
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    if (!this.isEnabled) {
      logInfo('Email notifications are disabled');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Verify connection
      await this.transporter?.verify();
      logInfo('Email service initialized successfully');
    } catch (error) {
      logError('Failed to initialize email service', error as Error);
      this.transporter = null;
    }
  }

  private async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter || !this.isEnabled) {
      logInfo('Email service not available, skipping email send');
      return false;
    }

    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@gdpr-consent.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      const result = await this.transporter.sendMail(mailOptions);
      logInfo('Email sent successfully', { to: options.to, messageId: result.messageId });
      return true;
    } catch (error) {
      logError('Failed to send email', error as Error, { to: options.to });
      return false;
    }
  }

  async sendConsentConfirmation(userEmail: string, userName: string): Promise<boolean> {
    const subject = 'Consent Preferences Confirmed';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Consent Preferences Confirmed</h2>
        <p>Dear ${userName},</p>
        <p>Thank you for updating your consent preferences. Your choices have been recorded and will be respected in all our communications and data processing activities.</p>
        <p>If you need to update your preferences in the future, you can do so at any time by visiting our consent management portal.</p>
        <p>If you have any questions about your data or privacy rights, please don't hesitate to contact us.</p>
        <br>
        <p>Best regards,<br>The Privacy Team</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666;">
          This email was sent to confirm your consent preferences.
          If you did not make this request, please contact us immediately.
        </p>
      </div>
    `;

    return this.sendEmail({ to: userEmail, subject, html });
  }

  async sendConsentChangeNotification(notification: ConsentChangeNotification): Promise<boolean> {
    const subject = 'Consent Preferences Updated';
    const changesHtml = notification.changes
      .map(
        (change) => `
        <li>
          <strong>${change.option}:</strong>
          ${change.previousValue ? 'Enabled' : 'Disabled'} →
          ${change.newValue ? 'Enabled' : 'Disabled'}
        </li>
      `
      )
      .join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Consent Preferences Updated</h2>
        <p>Dear ${notification.userName},</p>
        <p>Your consent preferences have been updated on ${notification.timestamp.toLocaleDateString()}.</p>
        <h3>Changes made:</h3>
        <ul style="line-height: 1.6;">
          ${changesHtml}
        </ul>
        <p>These changes are now in effect and will be applied to all future communications and data processing activities.</p>
        <p>If you did not make these changes or have any concerns, please contact us immediately.</p>
        <br>
        <p>Best regards,<br>The Privacy Team</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666;">
          This email was sent to notify you of changes to your consent preferences.
        </p>
      </div>
    `;

    return this.sendEmail({ to: notification.userEmail, subject, html });
  }

  async sendAdminAlert(message: string, details?: any): Promise<boolean> {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      logInfo('No admin email configured for alerts');
      return false;
    }

    const subject = 'GDPR Consent System Alert';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e74c3c;">System Alert</h2>
        <p><strong>Message:</strong> ${message}</p>
        ${details ? `<p><strong>Details:</strong></p><pre>${JSON.stringify(details, null, 2)}</pre>` : ''}
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      </div>
    `;

    return this.sendEmail({ to: adminEmail, subject, html });
  }
}

export const emailService = new EmailService();
export default emailService;
