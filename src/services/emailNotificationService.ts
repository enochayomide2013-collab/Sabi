/**
 * SABI Client Email Notification Service
 * Dispatches automated transactional & status updates to the authenticated user's
 * registered email via the secure backend /api/send-email endpoint.
 * Sensitive SMTP/API credentials remain strictly on the backend.
 */

export interface EmailDispatchResult {
  success: boolean;
  messageId?: string;
  recipient?: string;
  error?: string;
}

export class EmailNotificationService {
  /**
   * Dispatches welcome & account confirmation email upon registration
   */
  public static async sendSignupNotification(user: {
    email: string;
    name: string;
    state?: string;
    lga?: string;
  }): Promise<EmailDispatchResult> {
    if (!user.email || !user.email.includes('@')) {
      return { success: false, error: 'Invalid user email address' };
    }

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: user.email,
          subject: 'Welcome to SABI Nigeria — Your Account is Verified',
          type: 'signup',
          data: {
            name: user.name,
            state: user.state || 'Lagos',
            lga: user.lga || 'Ikeja'
          }
        })
      });

      const data = await response.json();
      return {
        success: response.ok && data.success,
        messageId: data.messageId,
        recipient: user.email,
        error: data.error
      };
    } catch (err: any) {
      console.warn('[Email Notification Warning] Could not reach email endpoint:', err);
      return {
        success: false,
        recipient: user.email,
        error: err?.message || 'Network error'
      };
    }
  }

  /**
   * Dispatches confirmation email when user submits a new verification report
   */
  public static async sendReportSubmissionNotification(
    user: { email: string; name: string },
    report: { claim: string; location: string; reportId?: string }
  ): Promise<EmailDispatchResult> {
    if (!user.email || !user.email.includes('@')) {
      return { success: false, error: 'User does not have a registered email address' };
    }

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: user.email,
          subject: `SABI Report Received: "${report.claim.substring(0, 45)}..."`,
          type: 'report_submitted',
          data: {
            name: user.name,
            claim: report.claim,
            location: report.location,
            reportId: report.reportId || ('rep_' + Date.now())
          }
        })
      });

      const data = await response.json();
      return {
        success: response.ok && data.success,
        messageId: data.messageId,
        recipient: user.email,
        error: data.error
      };
    } catch (err: any) {
      console.warn('[Email Notification Warning] Could not dispatch report confirmation:', err);
      return {
        success: false,
        recipient: user.email,
        error: err?.message || 'Network error'
      };
    }
  }

  /**
   * Dispatches status change confirmation when a report is verified, debunked, or resolved
   */
  public static async sendReportStatusNotification(
    user: { email: string; name: string },
    statusData: {
      claim: string;
      status: string;
      summary?: string;
      pointsEarned?: number;
    }
  ): Promise<EmailDispatchResult> {
    if (!user.email || !user.email.includes('@')) {
      return { success: false, error: 'User does not have a registered email address' };
    }

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: user.email,
          subject: `SABI Status Update: [${statusData.status}] "${statusData.claim.substring(0, 40)}..."`,
          type: 'report_status',
          data: {
            name: user.name,
            claim: statusData.claim,
            status: statusData.status,
            summary: statusData.summary || 'Verified through community consensus & evidence comparison.',
            pointsEarned: statusData.pointsEarned || 25
          }
        })
      });

      const data = await response.json();
      return {
        success: response.ok && data.success,
        messageId: data.messageId,
        recipient: user.email,
        error: data.error
      };
    } catch (err: any) {
      console.warn('[Email Notification Warning] Could not dispatch status update:', err);
      return {
        success: false,
        recipient: user.email,
        error: err?.message || 'Network error'
      };
    }
  }
}
