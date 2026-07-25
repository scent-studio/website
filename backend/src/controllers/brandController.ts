const Brand = require('../models/Brand');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getBrands = asyncHandler(async (req: any, res: any) => {
  const { isActive } = req.query;
  const filter: any = {};
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const brands = await Brand.find(filter).sort('name');

  res.status(200).json(ApiResponse.success(brands));
});

const getBrand = asyncHandler(async (req: any, res: any) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    throw ApiError.notFound('Brand not found');
  }

  res.status(200).json(ApiResponse.success(brand));
});

const getBrandBySlug = asyncHandler(async (req: any, res: any) => {
  const brand = await Brand.findOne({ slug: req.params.slug });

  if (!brand) {
    throw ApiError.notFound('Brand not found');
  }

  res.status(200).json(ApiResponse.success(brand));
});

const createBrand = asyncHandler(async (req: any, res: any) => {
  const existing = await Brand.findOne({ name: req.body.name });
  if (existing) {
    throw ApiError.conflict('Brand with this name already exists');
  }

  const brand = await Brand.create(req.body);

  res.status(201).json(ApiResponse.created(brand));
});

const updateBrand = asyncHandler(async (req: any, res: any) => {
  if (req.body.name) {
    const existing = await Brand.findOne({ name: req.body.name, _id: { $ne: req.params.id } });
    if (existing) {
      throw ApiError.conflict('Brand with this name already exists');
    }
  }

  const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!brand) {
    throw ApiError.notFound('Brand not found');
  }

  res.status(200).json(ApiResponse.updated(brand));
});

const deleteBrand = asyncHandler(async (req: any, res: any) => {
  const Product = require('../models/Product');
  const productCount = await Product.countDocuments({ brand: req.params.id });

  if (productCount > 0) {
    throw ApiError.badRequest(`Cannot delete brand. ${productCount} products are using this brand.`);
  }

  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (!brand) {
    throw ApiError.notFound('Brand not found');
  }

  res.status(200).json(ApiResponse.deleted('Brand deleted successfully'));
});

module.exports = {
  getBrands,
  getBrand,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
};

export {};
