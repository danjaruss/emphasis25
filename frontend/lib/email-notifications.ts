import type { Notification } from "@/hooks/use-notifications"

export type EmailFrequency = "immediate" | "daily" | "weekly" | "never"

export type EmailPreferences = {
  project_updates: EmailFrequency
  comments: EmailFrequency
  milestones: EmailFrequency
  collaboration: EmailFrequency
  system: EmailFrequency
  digest_time: string // "09:00" format
  digest_day: number // 0-6 for weekly (0 = Sunday)
}

export type EmailTemplate = {
  subject: string
  html: string
  text: string
}

export const defaultEmailPreferences: EmailPreferences = {
  project_updates: "daily",
  comments: "immediate",
  milestones: "immediate",
  collaboration: "daily",
  system: "weekly",
  digest_time: "09:00",
  digest_day: 1, // Monday
}

export function shouldSendImmediateEmail(notification: Notification, preferences: EmailPreferences): boolean {
  const frequency = preferences[notification.type]
  return frequency === "immediate"
}

// Enhanced email templates for approval notifications
export function generateApprovalEmailTemplate(
  userEmail: string,
  userName: string,
  action: "approved" | "rejected",
  adminMessage: string,
  adminName: string,
): EmailTemplate {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://your-app.vercel.app"

  const subject = `[Project EMPHASIS] Registration ${action === "approved" ? "Approved" : "Rejected"}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.6; 
          color: #272f51; 
          margin: 0; 
          padding: 0; 
          background-color: #F7FFF7;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white; 
          border-radius: 8px; 
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(39, 47, 81, 0.1);
        }
        .header { 
          background: ${action === "approved" ? "linear-gradient(135deg, #22504f 0%, #CDE7B0 100%)" : "linear-gradient(135deg, #dc2626 0%, #fca5a5 100%)"}; 
          color: white; 
          padding: 24px; 
          text-align: center; 
        }
        .logo { 
          width: 48px; 
          height: 48px; 
          margin: 0 auto 12px; 
          background: white; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          font-weight: bold;
          color: #272f51;
        }
        .content { 
          padding: 32px 24px; 
        }
        .status-card {
          background: ${action === "approved" ? "#d0fff6" : "#fee2e2"};
          border-left: 4px solid ${action === "approved" ? "#22504f" : "#dc2626"};
          padding: 16px;
          margin: 16px 0;
          border-radius: 0 4px 4px 0;
        }
        .status-title {
          font-weight: 600;
          color: ${action === "approved" ? "#22504f" : "#dc2626"};
          margin-bottom: 8px;
          font-size: 18px;
        }
        .admin-message {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 16px;
          border-radius: 8px;
          margin: 16px 0;
        }
        .cta-button {
          display: inline-block;
          background: ${action === "approved" ? "#22504f" : "#6b7280"};
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          margin: 16px 0;
          text-align: center;
        }
        .footer { 
          background: #ACD7EC; 
          padding: 24px; 
          text-align: center; 
          font-size: 14px; 
          color: #272f51; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">PE</div>
          <h1 style="margin: 0; font-size: 20px;">project EMPHASIS</h1>
          <p style="margin: 8px 0 0; font-size: 12px; opacity: 0.9;">SUSTAINABLE ISLAND STATE SOLUTIONS</p>
        </div>
        
        <div class="content">
          <h2 style="color: #272f51; margin-top: 0;">Registration ${action === "approved" ? "Approved" : "Rejected"}</h2>
          
          <p>Dear ${userName},</p>
          
          <div class="status-card">
            <div class="status-title">
              ${action === "approved" ? "✅ Welcome to Project EMPHASIS!" : "❌ Registration Not Approved"}
            </div>
            <p style="margin: 0; color: #374151;">
              ${
                action === "approved"
                  ? "Your registration has been approved and your account is now active. You can start collaborating on sustainable development projects across island nations."
                  : "Unfortunately, your registration could not be approved at this time. Please review the feedback below and consider reapplying."
              }
            </p>
          </div>
          
          ${
            adminMessage
              ? `
            <div class="admin-message">
              <h4 style="margin: 0 0 8px; color: #374151;">Message from Administrator:</h4>
              <p style="margin: 0; color: #6b7280; font-style: italic;">"${adminMessage}"</p>
              <p style="margin: 8px 0 0; font-size: 12px; color: #9ca3af;">- ${adminName}</p>
            </div>
          `
              : ""
          }
          
          ${
            action === "approved"
              ? `
            <div style="text-align: center; margin: 32px 0;">
              <a href="${baseUrl}/auth" class="cta-button">Sign In to Your Account</a>
            </div>
            
            <h3 style="color: #272f51;">What's Next?</h3>
            <ul style="color: #6b7280;">
              <li>Complete your profile setup</li>
              <li>Explore existing projects in your region</li>
              <li>Start your first sustainable development project</li>
              <li>Connect with other professionals in your field</li>
            </ul>
          `
              : `
            <div style="text-align: center; margin: 32px 0;">
              <a href="${baseUrl}/auth" class="cta-button">Apply Again</a>
            </div>
            
            <h3 style="color: #272f51;">Need Help?</h3>
            <p style="color: #6b7280;">
              If you have questions about this decision or need assistance with your application, 
              please contact our support team at support@emphasis.org
            </p>
          `
          }
        </div>
        
        <div class="footer">
          <p style="margin: 0 0 8px;">© 2024 Project EMPHASIS - Sustainable Island State Solutions</p>
          <p style="margin: 0; font-size: 12px;">
            <a href="${baseUrl}/contact" style="color: #22504f; text-decoration: none;">Contact Support</a> | 
            <a href="${baseUrl}/privacy" style="color: #22504f; text-decoration: none;">Privacy Policy</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
Project EMPHASIS - Registration ${action === "approved" ? "Approved" : "Rejected"}

Dear ${userName},

${
  action === "approved"
    ? "✅ Welcome to Project EMPHASIS! Your registration has been approved and your account is now active."
    : "❌ Unfortunately, your registration could not be approved at this time."
}

${adminMessage ? `Administrator Message: "${adminMessage}" - ${adminName}` : ""}

${
  action === "approved"
    ? `
What's Next:
- Complete your profile setup
- Explore existing projects in your region  
- Start your first sustainable development project
- Connect with other professionals in your field

Sign in to your account: ${baseUrl}/auth
`
    : `
If you have questions about this decision or need assistance, please contact support@emphasis.org

Apply again: ${baseUrl}/auth
`
}

---
© 2024 Project EMPHASIS - Sustainable Island State Solutions
Contact: ${baseUrl}/contact | Privacy: ${baseUrl}/privacy
  `

  return { subject, html, text }
}

export function generateEmailTemplate(
  notifications: Notification[],
  userEmail: string,
  type: "immediate" | "daily" | "weekly",
): EmailTemplate {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://your-app.vercel.app"

  if (type === "immediate" && notifications.length === 1) {
    return generateImmediateEmailTemplate(notifications[0], baseUrl)
  }

  return generateDigestEmailTemplate(notifications, type, baseUrl)
}

function generateImmediateEmailTemplate(notification: Notification, baseUrl: string): EmailTemplate {
  const projectLink = notification.project_id ? `${baseUrl}/projects/${notification.project_id}` : `${baseUrl}/projects`

  const subject = `[Project EMPHASIS] ${notification.title}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.6; 
          color: #272f51; 
          margin: 0; 
          padding: 0; 
          background-color: #F7FFF7;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white; 
          border-radius: 8px; 
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(39, 47, 81, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #272f51 0%, #22504f 100%); 
          color: white; 
          padding: 24px; 
          text-align: center; 
        }
        .logo { 
          width: 48px; 
          height: 48px; 
          margin: 0 auto 12px; 
          background: white; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          font-weight: bold;
          color: #272f51;
        }
        .content { 
          padding: 32px 24px; 
        }
        .notification-card {
          background: #d0fff6;
          border-left: 4px solid #22504f;
          padding: 16px;
          margin: 16px 0;
          border-radius: 0 4px 4px 0;
        }
        .notification-title {
          font-weight: 600;
          color: #272f51;
          margin-bottom: 8px;
        }
        .notification-message {
          color: #22504f;
          margin-bottom: 12px;
        }
        .project-link {
          display: inline-block;
          background: #22504f;
          color: white;
          padding: 8px 16px;
          text-decoration: none;
          border-radius: 4px;
          font-size: 14px;
          margin-top: 12px;
        }
        .footer { 
          background: #ACD7EC; 
          padding: 24px; 
          text-align: center; 
          font-size: 14px; 
          color: #272f51; 
        }
        .unsubscribe { 
          color: #22504f; 
          text-decoration: none; 
          font-size: 12px; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">PE</div>
          <h1 style="margin: 0; font-size: 20px;">project EMPHASIS</h1>
          <p style="margin: 8px 0 0; font-size: 12px; opacity: 0.9;">SUSTAINABLE ISLAND STATE SOLUTIONS</p>
        </div>
        
        <div class="content">
          <h2 style="color: #272f51; margin-top: 0;">New Project Update</h2>
          
          <div class="notification-card">
            <div class="notification-title">${notification.title}</div>
            <div class="notification-message">${notification.message}</div>
            
            ${
              notification.project_name
                ? `
              <p style="margin: 8px 0; font-size: 14px; color: #22504f;">
                <strong>Project:</strong> ${notification.project_name}
              </p>
            `
                : ""
            }
            
            ${
              notification.metadata?.user_name
                ? `
              <p style="margin: 8px 0; font-size: 14px; color: #22504f;">
                <strong>Updated by:</strong> ${notification.metadata.user_name}
              </p>
            `
                : ""
            }
            
            ${
              notification.project_id
                ? `
              <a href="${projectLink}" class="project-link">View Project</a>
            `
                : ""
            }
          </div>
          
          <p style="color: #22504f; font-size: 14px;">
            This notification was sent because you have immediate email notifications enabled for ${notification.type.replace("_", " ")} updates.
          </p>
        </div>
        
        <div class="footer">
          <p style="margin: 0 0 8px;">© 2024 Project EMPHASIS - Sustainable Island State Solutions</p>
          <a href="${baseUrl}/settings/notifications" class="unsubscribe">Manage notification preferences</a>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
Project EMPHASIS - ${notification.title}

${notification.message}

${notification.project_name ? `Project: ${notification.project_name}` : ""}
${notification.metadata?.user_name ? `Updated by: ${notification.metadata.user_name}` : ""}

${notification.project_id ? `View Project: ${projectLink}` : ""}

---
This notification was sent because you have immediate email notifications enabled.
Manage your preferences: ${baseUrl}/settings/notifications

© 2024 Project EMPHASIS - Sustainable Island State Solutions
  `

  return { subject, html, text }
}

function generateDigestEmailTemplate(
  notifications: Notification[],
  type: "daily" | "weekly",
  baseUrl: string,
): EmailTemplate {
  const subject = `[Project EMPHASIS] Your ${type} project summary`

  const groupedNotifications = notifications.reduce(
    (acc, notification) => {
      if (!acc[notification.type]) {
        acc[notification.type] = []
      }
      acc[notification.type].push(notification)
      return acc
    },
    {} as Record<string, Notification[]>,
  )

  const typeLabels = {
    project_updates: "Project Updates",
    comments: "Comments",
    milestones: "Milestones",
    collaboration: "Team Activity",
    system: "System Updates",
  }

  const typeColors = {
    project_updates: "#272f51",
    comments: "#22504f",
    milestones: "#CDE7B0",
    collaboration: "#d0fff6",
    system: "#ACD7EC",
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.6; 
          color: #272f51; 
          margin: 0; 
          padding: 0; 
          background-color: #F7FFF7;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white; 
          border-radius: 8px; 
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(39, 47, 81, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #272f51 0%, #22504f 100%); 
          color: white; 
          padding: 24px; 
          text-align: center; 
        }
        .logo { 
          width: 48px; 
          height: 48px; 
          margin: 0 auto 12px; 
          background: white; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          font-weight: bold;
          color: #272f51;
        }
        .content { 
          padding: 32px 24px; 
        }
        .summary-stats {
          display: flex;
          justify-content: space-around;
          margin: 24px 0;
          padding: 16px;
          background: #d0fff6;
          border-radius: 8px;
        }
        .stat {
          text-align: center;
        }
        .stat-number {
          font-size: 24px;
          font-weight: bold;
          color: #272f51;
        }
        .stat-label {
          font-size: 12px;
          color: #22504f;
          text-transform: uppercase;
        }
        .section {
          margin: 24px 0;
        }
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #272f51;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid #ACD7EC;
        }
        .notification-item {
          padding: 12px;
          margin: 8px 0;
          border-radius: 4px;
          border-left: 4px solid;
        }
        .notification-title {
          font-weight: 500;
          margin-bottom: 4px;
        }
        .notification-meta {
          font-size: 12px;
          color: #22504f;
          margin-top: 4px;
        }
        .cta-button {
          display: inline-block;
          background: #22504f;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          margin: 16px 0;
          text-align: center;
        }
        .footer { 
          background: #ACD7EC; 
          padding: 24px; 
          text-align: center; 
          font-size: 14px; 
          color: #272f51; 
        }
        .unsubscribe { 
          color: #22504f; 
          text-decoration: none; 
          font-size: 12px; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">PE</div>
          <h1 style="margin: 0; font-size: 20px;">project EMPHASIS</h1>
          <p style="margin: 8px 0 0; font-size: 12px; opacity: 0.9;">SUSTAINABLE ISLAND STATE SOLUTIONS</p>
        </div>
        
        <div class="content">
          <h2 style="color: #272f51; margin-top: 0;">Your ${type.charAt(0).toUpperCase() + type.slice(1)} Summary</h2>
          
          <div class="summary-stats">
            <div class="stat">
              <div class="stat-number">${notifications.length}</div>
              <div class="stat-label">Total Updates</div>
            </div>
            <div class="stat">
              <div class="stat-number">${Object.keys(groupedNotifications).length}</div>
              <div class="stat-label">Categories</div>
            </div>
            <div class="stat">
              <div class="stat-number">${new Set(notifications.map((n) => n.project_id).filter(Boolean)).size}</div>
              <div class="stat-label">Projects</div>
            </div>
          </div>

          ${Object.entries(groupedNotifications)
            .map(
              ([type, typeNotifications]) => `
            <div class="section">
              <div class="section-title">${typeLabels[type as keyof typeof typeLabels]} (${typeNotifications.length})</div>
              ${typeNotifications
                .slice(0, 5)
                .map(
                  (notification) => `
                <div class="notification-item" style="border-left-color: ${typeColors[type as keyof typeof typeColors]}; background: ${typeColors[type as keyof typeof typeColors]}15;">
                  <div class="notification-title">${notification.title}</div>
                  <div style="font-size: 14px; color: #22504f; margin: 4px 0;">${notification.message}</div>
                  ${
                    notification.project_name
                      ? `
                    <div class="notification-meta">Project: ${notification.project_name}</div>
                  `
                      : ""
                  }
                  ${
                    notification.metadata?.user_name
                      ? `
                    <div class="notification-meta">By: ${notification.metadata.user_name}</div>
                  `
                      : ""
                  }
                </div>
              `,
                )
                .join("")}
              ${
                typeNotifications.length > 5
                  ? `
                <p style="font-size: 14px; color: #22504f; margin: 8px 0;">
                  And ${typeNotifications.length - 5} more ${type.replace("_", " ")} updates...
                </p>
              `
                  : ""
              }
            </div>
          `,
            )
            .join("")}
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${baseUrl}/projects" class="cta-button">View All Projects</a>
          </div>
          
          <p style="color: #22504f; font-size: 14px;">
            You're receiving this ${type} digest because you have email notifications enabled. 
            You can change your preferences anytime.
          </p>
        </div>
        
        <div class="footer">
          <p style="margin: 0 0 8px;">© 2024 Project EMPHASIS - Sustainable Island State Solutions</p>
          <a href="${baseUrl}/settings/notifications" class="unsubscribe">Manage notification preferences</a>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
Project EMPHASIS - Your ${type.charAt(0).toUpperCase() + type.slice(1)} Summary

You have ${notifications.length} updates across ${Object.keys(groupedNotifications).length} categories.

${Object.entries(groupedNotifications)
  .map(
    ([type, typeNotifications]) => `
${typeLabels[type as keyof typeof typeLabels]} (${typeNotifications.length}):
${typeNotifications
  .slice(0, 3)
  .map((n) => `- ${n.title}: ${n.message}`)
  .join("\n")}
${typeNotifications.length > 3 ? `... and ${typeNotifications.length - 3} more` : ""}
`,
  )
  .join("\n")}

View all projects: ${baseUrl}/projects

---
Manage your preferences: ${baseUrl}/settings/notifications
© 2024 Project EMPHASIS - Sustainable Island State Solutions
  `

  return { subject, html, text }
}

export async function sendEmail(to: string, template: EmailTemplate): Promise<boolean> {
  try {
    // In a real implementation, you would use a service like:
    // - Resend (recommended for Vercel)
    // - SendGrid
    // - AWS SES
    // - Postmark

    console.log(`📧 Email would be sent to: ${to}`)
    console.log(`📧 Subject: ${template.subject}`)
    console.log(`📧 HTML length: ${template.html.length} characters`)
    console.log(`📧 Text length: ${template.text.length} characters`)

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return true
  } catch (error) {
    console.error("Failed to send email:", error)
    return false
  }
}

export async function sendApprovalEmail(
  userEmail: string,
  userName: string,
  action: "approved" | "rejected",
  adminMessage: string,
  adminName: string,
): Promise<boolean> {
  const template = generateApprovalEmailTemplate(userEmail, userName, action, adminMessage, adminName)
  return await sendEmail(userEmail, template)
}

export async function queueEmailNotification(
  userEmail: string,
  notification: Notification,
  preferences: EmailPreferences,
): Promise<void> {
  if (shouldSendImmediateEmail(notification, preferences)) {
    const template = generateEmailTemplate([notification], userEmail, "immediate")
    await sendEmail(userEmail, template)
  }
}

export async function sendDigestEmails(
  type: "daily" | "weekly",
  userEmail: string,
  notifications: Notification[],
): Promise<void> {
  if (notifications.length === 0) return

  const template = generateEmailTemplate(notifications, userEmail, type)
  await sendEmail(userEmail, template)
}
