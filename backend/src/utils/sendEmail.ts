const nodemailer = require('nodemailer');
const env = require('../config/env');

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  if (!options.to) return;
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    console.warn('SMTP not configured — skipping email to', options.to);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
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

const formatPKR = (amount: number) =>
  `Rs. ${Math.round(Number(amount) || 0).toLocaleString('en-PK')}`;

const sendOrderConfirmationEmail = async (email: string, orderDetails: any): Promise<void> => {
  if (!email) return;

  const orderId = String(orderDetails._id || '');
  const shortId = orderId.slice(-8).toUpperCase();
  const customerName =
    orderDetails.guestInfo?.name ||
    orderDetails.shippingAddress?.name ||
    'Customer';
  const items = Array.isArray(orderDetails.orderItems) ? orderDetails.orderItems : [];
  const itemRows = items
    .map(
      (item: any) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eee;color:#333;">
          ${item.name || 'Product'}${item.size ? ` (${item.size})` : ''}
          <div style="color:#888;font-size:12px;">Qty: ${item.quantity}</div>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;color:#333;">
          ${formatPKR((item.price || 0) * (item.quantity || 1))}
        </td>
      </tr>`
    )
    .join('');

  const paymentLabel =
    orderDetails.paymentMethod === 'cash_on_delivery'
      ? 'Cash on Delivery'
      : orderDetails.paymentMethod === 'bank_transfer'
        ? 'Bank Transfer'
        : orderDetails.paymentMethod || '—';

  await sendEmail({
    to: email,
    subject: `Thank you for your order #${shortId} — Scent Studio`,
    text: `Hi ${customerName},\n\nThank you for ordering from Scent Studio!\nOrder #${shortId}\nTotal: ${formatPKR(orderDetails.total)}\n\nWe will notify you when your order ships.\n\n— Scent Studio`,
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:24px;background:#faf8f5;color:#2c2c2c;">
        <div style="text-align:center;padding-bottom:20px;border-bottom:1px solid #e8e0d4;">
          <h1 style="margin:0;font-size:24px;letter-spacing:0.12em;font-weight:normal;">Scent Studio</h1>
          <p style="margin:8px 0 0;color:#8a7a5e;font-size:13px;">Premium Fragrances in Pakistan</p>
        </div>
        <h2 style="font-size:20px;font-weight:normal;margin:28px 0 12px;">Thank you for your order!</h2>
        <p style="line-height:1.6;color:#555;">
          Hi ${customerName}, we received your order and we're getting it ready.
          Your order confirmation number is <strong>#${shortId}</strong>.
        </p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0;">
          ${itemRows}
        </table>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr>
            <td style="padding:4px 0;color:#777;">Subtotal</td>
            <td style="padding:4px 0;text-align:right;">${formatPKR(orderDetails.subtotal)}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#777;">Shipping</td>
            <td style="padding:4px 0;text-align:right;">${
              Number(orderDetails.shippingCost) === 0 ? 'Free' : formatPKR(orderDetails.shippingCost)
            }</td>
          </tr>
          ${
            Number(orderDetails.discount) > 0
              ? `<tr>
            <td style="padding:4px 0;color:#777;">Discount</td>
            <td style="padding:4px 0;text-align:right;color:#2d6a4f;">-${formatPKR(orderDetails.discount)}</td>
          </tr>`
              : ''
          }
          <tr>
            <td style="padding:12px 0 0;font-size:16px;border-top:1px solid #e8e0d4;"><strong>Total</strong></td>
            <td style="padding:12px 0 0;text-align:right;font-size:16px;border-top:1px solid #e8e0d4;"><strong>${formatPKR(orderDetails.total)}</strong></td>
          </tr>
        </table>
        <p style="color:#555;line-height:1.6;font-size:14px;">
          <strong>Payment:</strong> ${paymentLabel}<br/>
          <strong>Ship to:</strong> ${orderDetails.shippingAddress?.street || ''},
          ${orderDetails.shippingAddress?.city || ''}
          ${orderDetails.shippingAddress?.state ? `, ${orderDetails.shippingAddress.state}` : ''}
        </p>
        <p style="color:#555;line-height:1.6;">
          We'll notify you when your order ships. If you have any questions, reply to this email or WhatsApp us.
        </p>
        <p style="margin-top:32px;color:#8a7a5e;font-size:13px;text-align:center;">
          With love,<br/>Scent Studio
        </p>
      </div>
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
