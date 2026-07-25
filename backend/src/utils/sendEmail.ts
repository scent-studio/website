const nodemailer = require('nodemailer');
const env = require('../config/env');

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  const message = {
    from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  await transporter.sendMail(message);
};

const sendPasswordResetEmail = async (email: string, resetUrl: string): Promise<void> => {
  await sendEmail({
    to: email,
    subject: 'Password Reset Request - Scent Studio',
    html: `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
      <p>This link will expire in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  });
};

const sendVerificationEmail = async (email: string, verificationUrl: string): Promise<void> => {
  await sendEmail({
    to: email,
    subject: 'Email Verification - Scent Studio',
    html: `
      <h1>Email Verification</h1>
      <p>Thank you for registering. Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}" clicktracking="off">${verificationUrl}</a>
      <p>This link will expire in 24 hours.</p>
    `,
  });
};

const sendOrderConfirmationEmail = async (email: string, orderDetails: any): Promise<void> => {
  await sendEmail({
    to: email,
    subject: `Order Confirmation - #${orderDetails._id}`,
    html: `
      <h1>Order Confirmed!</h1>
      <p>Thank you for your order. Your order #${orderDetails._id} has been confirmed.</p>
      <p>Total: Rs. ${orderDetails.total.toFixed(0)}</p>
      <p>We will notify you when your order ships.</p>
    `,
  });
};

const sendContactReplyEmail = async (email: string, reply: string, subject: string): Promise<void> => {
  await sendEmail({
    to: email,
    subject: `Re: ${subject} - Scent Studio`,
    html: `
      <h1>Response to your inquiry</h1>
      <p>${reply}</p>
    `,
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendOrderConfirmationEmail,
  sendContactReplyEmail,
};

export {};
