import nodemailer from "nodemailer";
import { logger } from "./logger.js";

export const sendEmail = async ({ to, subject, text, html }) => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = process.env.SMTP_PORT || 587;
  const from = process.env.SMTP_FROM || "no-reply@bizorm.com";

  if (!host || !user || !pass) {
    logger.warn(`[Email Sim Mode] SMTP unconfigured. Verification / Message logged to console:`);
    console.log(`================ EMAIL LOG ================`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: \n${text || html}`);
    console.log(`===========================================`);
    return { sent: true, mode: "simulated" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    logger.info(`Email sent to ${to} [ID: ${info.messageId}]`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`);
    return { sent: false, error: error.message };
  }
};

export const sendVerificationEmail = async (email, code) => {
  const subject = "Verify Your Bizorm Reviews Account";
  const text = `Your account verification code is: ${code}\n\nPlease enter this code to activate your account.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #294a63; text-align: center;">Bizorm Reviews</h2>
      <p>Thank you for registering! Please verify your account by using the code below:</p>
      <div style="font-size: 24px; font-weight: bold; text-align: center; padding: 15px; margin: 20px 0; background-color: #f8fafc; border: 1px dashed #cbd5e1; color: #294a63; letter-spacing: 2px;">
        ${code}
      </div>
      <p style="color: #64748b; font-size: 13px;">If you did not request this, please ignore this email.</p>
    </div>
  `;
  return await sendEmail({ to: email, subject, text, html });
};
