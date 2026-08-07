const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');
const { clearCache, getCache, setCache } = require('../middleware/cache');
const { generateThumbnail } = require('../utils/thumbnail');

const listProjection = {
  name: 1,
  slug: 1,
  thumbnail: 1,
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

const mapToImageUrls = (products: any[]) =>
  products.map((p) => {
    const doc = p.toObject ? p.toObject() : { ...p };
    if (doc.thumbnail) {
      doc.images = [doc.thumbnail];
    } else {
      doc.images = [`/api/products/image/${doc._id}/0`];
    }
    delete doc.thumbnail;
    return doc;
  });

const IMAGE_CACHE_TTL = 60 * 60 * 1000;

const getProductImage = asyncHandler(async (req: any, res: any) => {
  const cacheKey = `img:${req.params.id}:${req.params.index || '0'}`;
  const cached = getCache(cacheKey);
  if (cached) {
    res.setHeader('Content-Type', cached.mime);
    res.setHeader('Cache-Control', 'public, s-maxage=3600, max-age=3600');
    return res.send(cached.buffer);
  }

  const product = await Product.findById(req.params.id, { images: 1 }).lean();
  const index = parseInt(req.params.index || '0', 10);

  if (!product || !Array.isArray(product.images) || !product.images[index]) {
    throw ApiError.notFound('Image not found');
  }

  const raw = product.images[index] as string;
  const match = raw.match(/^data:([\w\/\+\.\-]+);base64,(.*)$/);
  if (!match) {
    throw ApiError.badRequest('Invalid image data');
  }

  const mime = match[1];
  const buffer = Buffer.from(match[2], 'base64');

  setCache(cacheKey, { mime, buffer }, IMAGE_CACHE_TTL);

  res.setHeader('Content-Type', mime);
  res.setHeader('Cache-Control', 'public, s-maxage=3600, max-age=3600');
  res.send(buffer);
});

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
    ApiResponse.success(mapToImageUrls(products), undefined, total, {
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
  const body = { ...req.body };
  if (body.images?.[0]) {
    body.thumbnail = await generateThumbnail(body.images[0]);
  }
  const product = await Product.create(body);
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

  if (rest.images?.[0]) {
    product.thumbnail = await generateThumbnail(rest.images[0]);
  }

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

  res.status(200).json(ApiResponse.success(mapToImageUrls(products)));
});

const getTrending = asyncHandler(async (req: any, res: any) => {
  const limit = parseInt(req.query.limit) || 8;

  const products = await Product.find({ isTrending: true, isVisible: true }, listProjection)
    .populate('category', 'name slug')
    .populate('brand', 'name slug logo')
    .limit(limit)
    .sort('-totalSales');

  res.status(200).json(ApiResponse.success(mapToImageUrls(products)));
});

const getBestSellers = asyncHandler(async (req: any, res: any) => {
  const limit = parseInt(req.query.limit) || 8;

  const products = await Product.find({ isBestSeller: true, isVisible: true }, listProjection)
    .populate('category', 'name slug')
    .populate('brand', 'name slug logo')
    .limit(limit)
    .sort('-totalSales');

  res.status(200).json(ApiResponse.success(mapToImageUrls(products)));
});

const getNewArrivals = asyncHandler(async (req: any, res: any) => {
  const limit = parseInt(req.query.limit) || 8;

  const products = await Product.find({ isNewArrival: true, isVisible: true }, listProjection)
    .populate('category', 'name slug')
    .populate('brand', 'name slug logo')
    .limit(limit)
    .sort('-createdAt');

  res.status(200).json(ApiResponse.success(mapToImageUrls(products)));
});

const homePopulateStages = [
  {
    $lookup: {
      from: 'categories',
      localField: 'category',
      foreignField: '_id',
      as: 'category',
      pipeline: [{ $project: { name: 1, slug: 1 } }],
    },
  },
  { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: 'brands',
      localField: 'brand',
      foreignField: '_id',
      as: 'brand',
      pipeline: [{ $project: { name: 1, slug: 1, logo: 1 } }],
    },
  },
  { $unwind: { path: '$brand', preserveNullAndEmptyArrays: true } },
  { $project: listProjection },
];

const homeFacet = (match: Record<string, unknown>, limit: number) => [
  { $match: { isVisible: true, ...match } },
  { $sort: { createdAt: -1 as const } },
  { $limit: limit },
  ...homePopulateStages,
];

const getHomeData = asyncHandler(async (_req: any, res: any) => {
  const [result] = await Product.aggregate([
    {
      $facet: {
        bundles: homeFacet({ isGiftSet: true }, 4),
        newArrivals: homeFacet({ isNewArrival: true }, 4),
        newArrivals100: homeFacet(
          { isNewArrival: true, 'sizes.size': { $regex: '100', $options: 'i' } },
          4
        ),
        bestSellers: homeFacet({ isBestSeller: true }, 4),
        women: homeFacet({ gender: 'female' }, 4),
        men: homeFacet({ gender: 'male' }, 4),
        unisex: homeFacet({ gender: 'unisex' }, 4),
      },
    },
  ]);

  res.status(200).json(
    ApiResponse.success({
      bundles: mapToImageUrls(result.bundles),
      newArrivals: mapToImageUrls(result.newArrivals),
      newArrivals100: mapToImageUrls(result.newArrivals100),
      bestSellers: mapToImageUrls(result.bestSellers),
      women: mapToImageUrls(result.women),
      men: mapToImageUrls(result.men),
      unisex: mapToImageUrls(result.unisex),
    })
  );
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

  res.status(200).json(ApiResponse.success(mapToImageUrls(related)));
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
    ApiResponse.success(mapToImageUrls(products), undefined, total, {
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
  getHomeData,
  searchProducts,
  getProductImage,
};

export {};
