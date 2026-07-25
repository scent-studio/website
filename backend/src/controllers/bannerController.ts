const Banner = require('../models/Banner');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getBanners = asyncHandler(async (req: any, res: any) => {
  const { type, isActive } = req.query;
  const filter: any = {};

  if (type) filter.type = type;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const banners = await Banner.find(filter).sort('order');

  res.status(200).json(ApiResponse.success(banners));
});

const getActiveBanners = asyncHandler(async (req: any, res: any) => {
  const { type } = req.query;
  const filter: any = { isActive: true };

  if (type) filter.type = type;

  const banners = await Banner.find(filter).sort('order');

  res.status(200).json(ApiResponse.success(banners));
});

const getBanner = asyncHandler(async (req: any, res: any) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    throw ApiError.notFound('Banner not found');
  }

  res.status(200).json(ApiResponse.success(banner));
});

const createBanner = asyncHandler(async (req: any, res: any) => {
  const banner = await Banner.create(req.body);

  res.status(201).json(ApiResponse.created(banner));
});

const updateBanner = asyncHandler(async (req: any, res: any) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!banner) {
    throw ApiError.notFound('Banner not found');
  }

  res.status(200).json(ApiResponse.updated(banner));
});

const deleteBanner = asyncHandler(async (req: any, res: any) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) {
    throw ApiError.notFound('Banner not found');
  }

  res.status(200).json(ApiResponse.deleted('Banner deleted successfully'));
});

module.exports = {
  getBanners,
  getActiveBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
};

export {};
