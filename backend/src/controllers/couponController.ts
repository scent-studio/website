const Coupon = require('../models/Coupon');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getCoupons = asyncHandler(async (req: any, res: any) => {
  const { isActive } = req.query;
  const filter: any = {};
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const coupons = await Coupon.find(filter).sort('-createdAt');

  res.status(200).json(ApiResponse.success(coupons));
});

const getCoupon = asyncHandler(async (req: any, res: any) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    throw ApiError.notFound('Coupon not found');
  }

  res.status(200).json(ApiResponse.success(coupon));
});

const createCoupon = asyncHandler(async (req: any, res: any) => {
  const { code } = req.body;

  const existing = await Coupon.findOne({ code: code.toUpperCase() });
  if (existing) {
    throw ApiError.conflict('Coupon with this code already exists');
  }

  const coupon = await Coupon.create({
    ...req.body,
    code: code.toUpperCase(),
  });

  res.status(201).json(ApiResponse.created(coupon));
});

const updateCoupon = asyncHandler(async (req: any, res: any) => {
  if (req.body.code) {
    req.body.code = req.body.code.toUpperCase();
    const existing = await Coupon.findOne({ code: req.body.code, _id: { $ne: req.params.id } });
    if (existing) {
      throw ApiError.conflict('Coupon with this code already exists');
    }
  }

  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!coupon) {
    throw ApiError.notFound('Coupon not found');
  }

  res.status(200).json(ApiResponse.updated(coupon));
});

const deleteCoupon = asyncHandler(async (req: any, res: any) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) {
    throw ApiError.notFound('Coupon not found');
  }

  res.status(200).json(ApiResponse.deleted('Coupon deleted successfully'));
});

const validateCoupon = asyncHandler(async (req: any, res: any) => {
  const { code, subtotal } = req.body;

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    throw ApiError.notFound('Coupon not found');
  }

  if (!coupon.isActive) {
    throw ApiError.badRequest('This coupon is no longer active');
  }

  if (coupon.isExpired) {
    throw ApiError.badRequest('This coupon has expired');
  }

  if (coupon.isMaxedOut) {
    throw ApiError.badRequest('This coupon has reached its usage limit');
  }

  if (subtotal && coupon.minOrder > 0 && subtotal < coupon.minOrder) {
    throw ApiError.badRequest(`Minimum order amount of Rs. ${coupon.minOrder} required`);
  }

  let discountAmount = 0;
  if (coupon.type === 'percentage') {
    discountAmount = (subtotal * coupon.value) / 100;
    if (coupon.maxDiscount > 0 && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else {
    discountAmount = coupon.value;
  }

  res.status(200).json(
    ApiResponse.success({
      coupon,
      discountAmount,
      finalAmount: subtotal ? subtotal - discountAmount : undefined,
    })
  );
});

module.exports = {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
};

export {};
