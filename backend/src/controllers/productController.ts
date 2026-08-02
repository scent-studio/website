const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');
const { clearCache } = require('../middleware/cache');

const listProjection = {
  name: 1,
  slug: 1,
  images: { $slice: 1 },
  price: 1,
  discount: 1,
  discountedPrice: 1,
  sizes: 1,
  rating: 1,
  numReviews: 1,
  gender: 1,
  tags: 1,
  isFeatured: 1,
  isTrending: 1,
  isBestSeller: 1,
  isNewArrival: 1,
  isGiftSet: 1,
  isLimitedEdition: 1,
  isVisible: 1,
  brand: 1,
  category: 1,
  stock: 1,
  createdAt: 1,
};

const getProducts = asyncHandler(async (req: any, res: any) => {
  const {
    page = 1,
    limit = 12,
    category,
    brand,
    minPrice,
    maxPrice,
    gender,
    concentration,
    season,
    occasion,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    isFeatured,
    isTrending,
    isBestSeller,
    isNewArrival,
    isGiftSet,
    tags,
  } = req.query;

  const queryFields: any = { isVisible: true };

  if (category) {
    if (mongoose.Types.ObjectId.isValid(category)) {
      queryFields.category = category;
    } else {
      const cat = await Category.findOne({ slug: category });
      if (!cat) {
        throw ApiError.notFound(`Invalid category: ${category}`);
      }
      queryFields.category = cat._id;
    }
  }
  if (brand) {
    if (mongoose.Types.ObjectId.isValid(brand)) {
      queryFields.brand = brand;
    } else {
      const b = await Brand.findOne({ slug: brand });
      if (!b) {
        throw ApiError.notFound(`Invalid brand: ${brand}`);
      }
      queryFields.brand = b._id;
    }
  }
  if (gender) queryFields.gender = gender;
  if (concentration) queryFields.concentration = concentration;
  if (season) queryFields.season = season;
  if (occasion) queryFields.occasion = occasion;
  if (isFeatured === 'true') queryFields.isFeatured = true;
  if (isTrending === 'true') queryFields.isTrending = true;
  if (isBestSeller === 'true') queryFields.isBestSeller = true;
  if (isNewArrival === 'true') queryFields.isNewArrival = true;
  if (isGiftSet === 'true') queryFields.isGiftSet = true;

  if (minPrice || maxPrice) {
    queryFields.discountedPrice = {};
    if (minPrice) queryFields.discountedPrice.$gte = parseFloat(minPrice);
    if (maxPrice) queryFields.discountedPrice.$lte = parseFloat(maxPrice);
  }

  if (search) {
    queryFields.$text = { $search: search };
  }

  if (tags) {
    const tagArray = typeof tags === 'string' ? tags.split(',') : tags;
    queryFields.tags = { $in: tagArray };
  }

  const sortObj: any = {};
  sortObj[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const products = await Product.find(queryFields, listProjection)
    .populate('category', 'name slug')
    .populate('brand', 'name slug logo')
    .skip(skip)
    .limit(limitNum)
    .sort(sortObj);

  const total = await Product.countDocuments(queryFields);

  res.status(200).json(
    ApiResponse.success(products, undefined, total, {
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      totalItems: total,
    })
  );
});

const getProduct = asyncHandler(async (req: any, res: any) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('brand', 'name slug logo');

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  res.status(200).json(ApiResponse.success(product));
});

const getProductBySlug = asyncHandler(async (req: any, res: any) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate('category', 'name slug')
    .populate('brand', 'name slug logo');

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  res.status(200).json(ApiResponse.success(product));
});

const createProduct = asyncHandler(async (req: any, res: any) => {
  clearCache();
  const product = await Product.create(req.body);
  const populated = await Product.findById(product._id)
    .populate('category', 'name slug')
    .populate('brand', 'name slug logo');

  res.status(201).json(ApiResponse.created(populated));
});

const updateProduct = asyncHandler(async (req: any, res: any) => {
  clearCache();
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  const { price, discountedPrice, discount, ...rest } = req.body;
  if (price !== undefined) product.price = price;
  if (discountedPrice !== undefined) product.discountedPrice = discountedPrice;
  if (discount !== undefined) product.discount = discount;
  Object.assign(product, rest);

  await product.save();

  const populated = await Product.findById(product._id)
    .populate('category', 'name slug')
    .populate('brand', 'name slug logo');

  res.status(200).json(ApiResponse.updated(populated));
});

const deleteProduct = asyncHandler(async (req: any, res: any) => {
  clearCache();
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  res.status(200).json(ApiResponse.deleted('Product deleted successfully'));
});

const getFeatured = asyncHandler(async (req: any, res: any) => {
  const limit = parseInt(req.query.limit) || 8;

  const products = await Product.find({ isFeatured: true, isVisible: true }, listProjection)
    .populate('category', 'name slug')
    .populate('brand', 'name slug logo')
    .limit(limit)
    .sort('-rating');

  res.status(200).json(ApiResponse.success(products));
});

const getTrending = asyncHandler(async (req: any, res: any) => {
  const limit = parseInt(req.query.limit) || 8;

  const products = await Product.find({ isTrending: true, isVisible: true }, listProjection)
    .populate('category', 'name slug')
    .populate('brand', 'name slug logo')
    .limit(limit)
    .sort('-totalSales');

  res.status(200).json(ApiResponse.success(products));
});

const getBestSellers = asyncHandler(async (req: any, res: any) => {
  const limit = parseInt(req.query.limit) || 8;

  const products = await Product.find({ isBestSeller: true, isVisible: true }, listProjection)
    .populate('category', 'name slug')
    .populate('brand', 'name slug logo')
    .limit(limit)
    .sort('-totalSales');

  res.status(200).json(ApiResponse.success(products));
});

const getNewArrivals = asyncHandler(async (req: any, res: any) => {
  const limit = parseInt(req.query.limit) || 8;

  const products = await Product.find({ isNewArrival: true, isVisible: true }, listProjection)
    .populate('category', 'name slug')
    .populate('brand', 'name slug logo')
    .limit(limit)
    .sort('-createdAt');

  res.status(200).json(ApiResponse.success(products));
});

const getRelated = asyncHandler(async (req: any, res: any) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  const related = await Product.find({
    _id: { $ne: product._id },
    $or: [
      { category: product.category },
      { brand: product.brand },
      { gender: product.gender },
    ],
    isVisible: true,
  }, listProjection)
    .populate('category', 'name slug')
    .populate('brand', 'name slug logo')
    .limit(4)
    .sort('-rating');

  res.status(200).json(ApiResponse.success(related));
});

const searchProducts = asyncHandler(async (req: any, res: any) => {
  const { q, page = 1, limit = 20 } = req.query;

  if (!q) {
    throw ApiError.badRequest('Search query is required');
  }

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const products = await Product.find(
    { $text: { $search: q as string }, isVisible: true },
    { ...listProjection, score: { $meta: 'textScore' } }
  )
    .populate('category', 'name slug')
    .populate('brand', 'name slug logo')
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(limitNum);

  const total = await Product.countDocuments({
    $text: { $search: q as string },
    isVisible: true,
  });

  res.status(200).json(
    ApiResponse.success(products, undefined, total, {
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      totalItems: total,
    })
  );
});

module.exports = {
  getProducts,
  getProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeatured,
  getTrending,
  getBestSellers,
  getNewArrivals,
  getRelated,
  searchProducts,
};

export {};
