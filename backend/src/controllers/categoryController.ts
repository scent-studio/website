const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { clearCache } = require('../middleware/cache');

const getCategories = asyncHandler(async (req: any, res: any) => {
  const { isActive } = req.query;
  const filter: any = {};
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const categories = await Category.find(filter).sort('name');

  res.status(200).json(ApiResponse.success(categories));
});

const getCategory = asyncHandler(async (req: any, res: any) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw ApiError.notFound('Category not found');
  }

  res.status(200).json(ApiResponse.success(category));
});

const getCategoryBySlug = asyncHandler(async (req: any, res: any) => {
  const category = await Category.findOne({ slug: req.params.slug });

  if (!category) {
    throw ApiError.notFound('Category not found');
  }

  res.status(200).json(ApiResponse.success(category));
});

const createCategory = asyncHandler(async (req: any, res: any) => {
  const existing = await Category.findOne({ name: req.body.name });
  if (existing) {
    throw ApiError.conflict('Category with this name already exists');
  }

  clearCache();
  const category = await Category.create(req.body);

  res.status(201).json(ApiResponse.created(category));
});

const updateCategory = asyncHandler(async (req: any, res: any) => {
  if (req.body.name) {
    const existing = await Category.findOne({ name: req.body.name, _id: { $ne: req.params.id } });
    if (existing) {
      throw ApiError.conflict('Category with this name already exists');
    }
  }

  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw ApiError.notFound('Category not found');
  }

  clearCache();
  res.status(200).json(ApiResponse.updated(category));
});

const deleteCategory = asyncHandler(async (req: any, res: any) => {
  const Product = require('../models/Product');
  const productCount = await Product.countDocuments({ category: req.params.id });

  if (productCount > 0) {
    throw ApiError.badRequest(`Cannot delete category. ${productCount} products are using this category.`);
  }

  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    throw ApiError.notFound('Category not found');
  }

  clearCache();
  res.status(200).json(ApiResponse.deleted('Category deleted successfully'));
});

module.exports = {
  getCategories,
  getCategory,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};

export {};
