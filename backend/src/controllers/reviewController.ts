const Review = require('../models/Review');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getProductReviews = asyncHandler(async (req: any, res: any) => {
  const { productId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter: any = { product: productId };

  if (req.user && req.user.role === 'admin') {
    // Admin can see all reviews
  } else {
    filter.isApproved = true;
  }

  const reviews = await Review.find(filter)
    .populate('user', 'name avatar')
    .skip(skip)
    .limit(limit)
    .sort('-createdAt');

  const total = await Review.countDocuments(filter);

  res.status(200).json(
    ApiResponse.success(reviews, undefined, total, {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    })
  );
});

const createReview = asyncHandler(async (req: any, res: any) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  const existingReview = await Review.findOne({
    user: req.user._id,
    product: productId,
  });

  if (existingReview) {
    throw ApiError.badRequest('You have already reviewed this product');
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating: req.body.rating,
    title: req.body.title,
    comment: req.body.comment,
    images: req.body.images || [],
  });

  const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');

  res.status(201).json(ApiResponse.created(populatedReview));
});

const updateReview = asyncHandler(async (req: any, res: any) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw ApiError.notFound('Review not found');
  }

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw ApiError.forbidden('Not authorized to update this review');
  }

  const { rating, title, comment, images } = req.body;

  if (rating) review.rating = rating;
  if (title) review.title = title;
  if (comment) review.comment = comment;
  if (images) review.images = images;

  review.isApproved = false;
  await review.save();

  const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');

  res.status(200).json(ApiResponse.updated(populatedReview));
});

const deleteReview = asyncHandler(async (req: any, res: any) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw ApiError.notFound('Review not found');
  }

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw ApiError.forbidden('Not authorized to delete this review');
  }

  await Review.findByIdAndDelete(req.params.id);

  res.status(200).json(ApiResponse.deleted('Review deleted successfully'));
});

const approveReview = asyncHandler(async (req: any, res: any) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  ).populate('user', 'name avatar');

  if (!review) {
    throw ApiError.notFound('Review not found');
  }

  res.status(200).json(ApiResponse.updated(review));
});

const rejectReview = asyncHandler(async (req: any, res: any) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { isApproved: false },
    { new: true }
  ).populate('user', 'name avatar');

  if (!review) {
    throw ApiError.notFound('Review not found');
  }

  res.status(200).json(ApiResponse.updated(review));
});

const getAllReviews = asyncHandler(async (req: any, res: any) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const { isApproved } = req.query;

  const filter: any = {};
  if (isApproved !== undefined) filter.isApproved = isApproved === 'true';

  const reviews = await Review.find(filter)
    .populate('user', 'name email avatar')
    .populate('product', 'name slug images')
    .skip(skip)
    .limit(limit)
    .sort('-createdAt');

  const total = await Review.countDocuments(filter);

  res.status(200).json(
    ApiResponse.success(reviews, undefined, total, {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    })
  );
});

module.exports = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  approveReview,
  rejectReview,
  getAllReviews,
};

export {};
