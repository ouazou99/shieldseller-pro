// Email notification system using Resend
// You can also use SendGrid, Mailgun, or any email service

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailParams) {
  // Using Resend (recommended for modern apps)
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'alerts@shieldseller.com',
          to: [to],
          subject,
          html,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      return { success: true };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }
  }

  // Fallback: Log to console in development
  console.log('📧 Email (no provider configured):');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('HTML:', html);
  
  return { success: true, dev: true };
}

// Pre-built email templates
export const emailTemplates = {
  violationDetected: (userName: string, shopName: string, violationCount: number, dashboardUrl: string) => ({
    subject: `⚠️ ${violationCount} New Violation${violationCount !== 1 ? 's' : ''} Detected - ${shopName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ef4444; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #0ea5e9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .warning { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">⚠️ Violation Alert</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              
              <div class="warning">
                <strong>Action Required:</strong> We detected ${violationCount} new violation${violationCount !== 1 ? 's' : ''} in your shop "${shopName}".
              </div>
              
              <p>These violations could lead to account suspension if not addressed quickly.</p>
              
              <p><strong>What to do:</strong></p>
              <ol>
                <li>Review the violations in your dashboard</li>
                <li>Follow the suggested fixes</li>
                <li>Update your listings immediately</li>
              </ol>
              
              <a href="${dashboardUrl}" class="button">View Violations →</a>
              
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Stay safe,<br>
                The ShieldSeller Team
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  dailyReport: (userName: string, stats: any, dashboardUrl: string) => ({
    subject: `📊 Daily Report - ${stats.shopName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0ea5e9; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .stat-card { background: white; padding: 15px; border-radius: 6px; text-align: center; }
            .stat-value { font-size: 32px; font-weight: bold; color: #0ea5e9; }
            .stat-label { font-size: 14px; color: #666; }
            .button { display: inline-block; background: #0ea5e9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">📊 Your Daily Report</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              
              <p>Here's your daily health check for <strong>${stats.shopName}</strong>:</p>
              
              <div class="stats">
                <div class="stat-card">
                  <div class="stat-value">${stats.riskScore}/100</div>
                  <div class="stat-label">Risk Score</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${stats.violations}</div>
                  <div class="stat-label">Open Violations</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${stats.listings}</div>
                  <div class="stat-label">Total Listings</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${stats.highRisk}</div>
                  <div class="stat-label">High Risk</div>
                </div>
              </div>
              
              ${stats.violations > 0 ? `
                <p style="color: #dc2626; font-weight: bold;">
                  ⚠️ You have ${stats.violations} violation${stats.violations !== 1 ? 's' : ''} that need attention.
                </p>
              ` : `
                <p style="color: #16a34a; font-weight: bold;">
                  ✅ Great! All your listings are compliant.
                </p>
              `}
              
              <a href="${dashboardUrl}" class="button">View Dashboard →</a>
              
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Stay protected,<br>
                The ShieldSeller Team
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  criticalAlert: (userName: string, listingTitle: string, violationType: string, dashboardUrl: string) => ({
    subject: `🚨 CRITICAL: Immediate Action Required`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .critical { background: #fee; border: 2px solid #dc2626; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🚨 CRITICAL ALERT</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              
              <div class="critical">
                <h2 style="margin-top: 0; color: #dc2626;">Immediate Action Required</h2>
                <p>We detected a <strong>CRITICAL</strong> violation in your listing:</p>
                <p><strong>"${listingTitle}"</strong></p>
                <p>Violation Type: <strong>${violationType}</strong></p>
              </div>
              
              <p><strong style="color: #dc2626;">This type of violation can lead to immediate account suspension.</strong></p>
              
              <p>What you need to do <strong>RIGHT NOW</strong>:</p>
              <ol>
                <li>Pause or remove the affected listing immediately</li>
                <li>Review the violation details</li>
                <li>Fix the issue before republishing</li>
              </ol>
              
              <a href="${dashboardUrl}" class="button">Fix Now →</a>
              
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Act fast,<br>
                The ShieldSeller Team
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};
