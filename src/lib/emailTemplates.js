/**
 * Generate HTML template for email verification
 * @param {string} userName - User's name
 * @param {string} verifyUrl - URL to verify email
 * @returns {string} HTML content
 */
export function getVerificationEmailTemplate(userName, verifyUrl) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          padding: 20px;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 32px;
          max-width: 600px;
          margin: 0 auto;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #1f2937;
          font-size: 24px;
          margin-bottom: 24px;
          text-align: center;
        }
        p {
          color: #4b5563;
          font-size: 16px;
          line-height: 24px;
          margin-bottom: 24px;
        }
        .button-wrapper {
          text-align: center;
          margin: 32px 0;
        }
        .button {
          display: inline-block;
          background-color: #2563eb;
          color: #ffffff;
          padding: 12px 32px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
        }
        .button:hover {
          background-color: #1d4ed8;
        }
        .link-section {
          font-size: 14px;
          color: #6b7280;
          margin: 24px 0;
          padding: 16px;
          background-color: #f9fafb;
          border-radius: 6px;
          word-break: break-all;
        }
        .footer {
          border-top: 1px solid #e5e7eb;
          margin-top: 32px;
          padding-top: 24px;
          text-align: center;
          font-size: 12px;
          color: #9ca3af;
        }
        .footer-text {
          margin: 8px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Verify Your Email Address</h1>
        
        <p>
          Thank you <strong>${userName}</strong> for signing up to Qandil AI! To complete your account setup and start using our services, 
          please verify your email address by clicking the button below.
        </p>
        
        <div class="button-wrapper">
          <a href="${verifyUrl}" class="button">Verify Email Address</a>
        </div>
        
        <p>
          This verification link will expire in 24 hours. If you didn't create an account, 
          you can safely ignore this email.
        </p>
        
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <div class="link-section">
          ${verifyUrl}
        </div>
        
        <div class="footer">
          <p class="footer-text">© 2026 Qandil AI. All rights reserved.</p>
          <p class="footer-text">This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate HTML template for password reset
 * @param {string} userName - User's name
 * @param {string} resetUrl - URL to reset password
 * @returns {string} HTML content
 */
export function getPasswordResetEmailTemplate(userName, resetUrl) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          padding: 20px;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 32px;
          max-width: 600px;
          margin: 0 auto;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #1f2937;
          font-size: 24px;
          margin-bottom: 24px;
          text-align: center;
        }
        p {
          color: #4b5563;
          font-size: 16px;
          line-height: 24px;
          margin-bottom: 24px;
        }
        .warning {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 12px 16px;
          margin: 16px 0;
          border-radius: 4px;
          color: #92400e;
        }
        .button-wrapper {
          text-align: center;
          margin: 32px 0;
        }
        .button {
          display: inline-block;
          background-color: #2563eb;
          color: #ffffff;
          padding: 12px 32px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
        }
        .button:hover {
          background-color: #1d4ed8;
        }
        .link-section {
          font-size: 14px;
          color: #6b7280;
          margin: 24px 0;
          padding: 16px;
          background-color: #f9fafb;
          border-radius: 6px;
          word-break: break-all;
        }
        .footer {
          border-top: 1px solid #e5e7eb;
          margin-top: 32px;
          padding-top: 24px;
          text-align: center;
          font-size: 12px;
          color: #9ca3af;
        }
        .footer-text {
          margin: 8px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Reset Your Password</h1>
        
        <p>
          Hi <strong>${userName}</strong>,
        </p>
        
        <p>
          We received a request to reset the password for your Qandil AI account. 
          Click the button below to set a new password.
        </p>
        
        <div class="button-wrapper">
          <a href="${resetUrl}" class="button">Reset Password</a>
        </div>
        
        <div class="warning">
          <strong>⚠️ Important:</strong> This link will expire in 24 hours. If you didn't request a password reset, 
          please ignore this email or contact support immediately if you suspect unauthorized access.
        </div>
        
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <div class="link-section">
          ${resetUrl}
        </div>
        
        <p>
          For your security, never share this link with anyone.
        </p>
        
        <div class="footer">
          <p class="footer-text">© 2026 Qandil AI. All rights reserved.</p>
          <p class="footer-text">This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
