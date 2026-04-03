import nodemailer from "nodemailer";

// Create a transporter for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email transporter ready");
  }
});

/**
 * Send verification email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 */
export async function sendVerificationEmail({ to, subject, html }) {
  try {
    console.log("📬 Preparing verification email for:", to);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: html,
    };

    console.log("📧 Sending email with options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ Verification email sent successfully!");
    console.log("📬 Message ID:", info.messageId);
    console.log("📨 Response:", info.response);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Failed to send verification email!");
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return { success: false, error: error.message };
  }
}

/**
 * Send password reset email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 */
export async function sendPasswordResetEmail({ to, subject, html }) {
  try {
    console.log("📬 Preparing password reset email for:", to);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: html,
    };

    console.log("📧 Sending password reset email with options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ Password reset email sent successfully!");
    console.log("📬 Message ID:", info.messageId);
    console.log("📨 Response:", info.response);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Failed to send password reset email!");
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return { success: false, error: error.message };
  }
}
