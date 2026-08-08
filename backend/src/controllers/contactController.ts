const ContactMessage = require('../models/ContactMessage');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { sendContactReplyEmail, sendEmail } = require('../utils/sendEmail');
const env = require('../config/env');

const submitContact = asyncHandler(async (req: any, res: any) => {
  const { name, email, phone, subject, message } = req.body;

  const contactMessage = await ContactMessage.create({
    name,
    email,
    phone: phone || '',
    subject,
    message,
  });

  // Notify store inbox (non-blocking)
  const notifyTo = env.SMTP_FROM_EMAIL || env.SMTP_USER;
  if (notifyTo) {
    sendEmail({
      to: notifyTo,
      subject: `New contact message: ${subject}`,
      text: `From: ${name} <${email}>\nPhone: ${phone || '—'}\n\n${message}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:20px;color:#2c2c2c;">
          <h2 style="margin:0 0 12px;font-weight:normal;">New contact message</h2>
          <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
          <p><strong>Phone:</strong> ${phone || '—'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p style="white-space:pre-wrap;line-height:1.6;border-top:1px solid #eee;padding-top:12px;">${message}</p>
        </div>
      `,
    }).catch((err: any) => {
      console.warn('Contact notification email failed:', err?.message || err);
    });
  }

  res.status(201).json(
    ApiResponse.created(contactMessage, 'Your message has been received. We will get back to you shortly.')
  );
});

const getAllMessages = asyncHandler(async (req: any, res: any) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const { isRead } = req.query;

  const filter: any = {};
  if (isRead !== undefined) filter.isRead = isRead === 'true';

  const messages = await ContactMessage.find(filter).skip(skip).limit(limit).sort('-createdAt');
  const total = await ContactMessage.countDocuments(filter);

  res.status(200).json(
    ApiResponse.success(messages, undefined, total, {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    })
  );
});

const getMessage = asyncHandler(async (req: any, res: any) => {
  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );

  if (!message) {
    throw ApiError.notFound('Message not found');
  }

  res.status(200).json(ApiResponse.success(message));
});

const markAsRead = asyncHandler(async (req: any, res: any) => {
  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );

  if (!message) {
    throw ApiError.notFound('Message not found');
  }

  res.status(200).json(ApiResponse.updated(message));
});

const replyToMessage = asyncHandler(async (req: any, res: any) => {
  const { reply } = req.body;

  const message = await ContactMessage.findById(req.params.id);
  if (!message) {
    throw ApiError.notFound('Message not found');
  }

  message.reply = reply;
  message.isRead = true;
  await message.save();

  await sendContactReplyEmail(message.email, reply, message.subject).catch(() => {
    console.warn('Reply email could not be sent');
  });

  res.status(200).json(ApiResponse.updated(message));
});

const deleteMessage = asyncHandler(async (req: any, res: any) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);

  if (!message) {
    throw ApiError.notFound('Message not found');
  }

  res.status(200).json(ApiResponse.deleted('Message deleted successfully'));
});

module.exports = {
  submitContact,
  getAllMessages,
  getMessage,
  markAsRead,
  replyToMessage,
  deleteMessage,
};

export {};
