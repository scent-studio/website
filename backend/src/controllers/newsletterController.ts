const Newsletter = require('../models/Newsletter');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const subscribe = asyncHandler(async (req: any, res: any) => {
  const { email } = req.body;

  const existing = await Newsletter.findOne({ email });

  if (existing) {
    if (!existing.isSubscribed) {
      existing.isSubscribed = true;
      existing.subscribedAt = new Date();
      await existing.save();
      return res.status(200).json(ApiResponse.message('Successfully resubscribed'));
    }
    throw ApiError.conflict('Email is already subscribed to our newsletter');
  }

  await Newsletter.create({ email });

  res.status(201).json(ApiResponse.message('Successfully subscribed to our newsletter'));
});

const unsubscribe = asyncHandler(async (req: any, res: any) => {
  const { token } = req.params;

  const decodedEmail = Buffer.from(token, 'base64').toString('utf-8');

  const subscription = await Newsletter.findOne({ email: decodedEmail });
  if (!subscription) {
    throw ApiError.notFound('Subscription not found');
  }

  subscription.isSubscribed = false;
  await subscription.save();

  res.status(200).json(ApiResponse.message('Successfully unsubscribed from our newsletter'));
});

const getAllSubscribers = asyncHandler(async (req: any, res: any) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const { isSubscribed } = req.query;

  const filter: any = {};
  if (isSubscribed !== undefined) filter.isSubscribed = isSubscribed === 'true';

  const subscribers = await Newsletter.find(filter).skip(skip).limit(limit).sort('-createdAt');
  const total = await Newsletter.countDocuments(filter);

  res.status(200).json(
    ApiResponse.success(subscribers, undefined, total, {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    })
  );
});

const deleteSubscriber = asyncHandler(async (req: any, res: any) => {
  const subscriber = await Newsletter.findByIdAndDelete(req.params.id);

  if (!subscriber) {
    throw ApiError.notFound('Subscriber not found');
  }

  res.status(200).json(ApiResponse.deleted('Subscriber deleted successfully'));
});

module.exports = {
  subscribe,
  unsubscribe,
  getAllSubscribers,
  deleteSubscriber,
};

export {};
