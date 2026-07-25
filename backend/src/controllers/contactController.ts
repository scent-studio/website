const ContactMessage = require('../models/ContactMessage');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { sendContactReplyEmail } = require('../utils/sendEmail');

const submitContact = asyncHandler(async (req: any, res: any) => {
  const { name, email, phone, subject, message } = req.body;

  const contactMessage = await ContactMessage.create({
    name,
    email,
    phone,
    subject,
    message,
  });

  res.status(201).json(ApiResponse.message('Your message has been received. We will get back to you shortly.'));
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
  replyToMessage,
  deleteMessage,
};

export {};
