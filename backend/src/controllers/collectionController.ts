const Collection = require('../models/Collection');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getCollections = asyncHandler(async (req: any, res: any) => {
  const { isActive } = req.query;
  const filter: any = {};
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const collections = await Collection.find(filter)
    .populate('products', 'name images price discountedPrice slug')
    .sort('name');

  res.status(200).json(ApiResponse.success(collections));
});

const getActiveCollections = asyncHandler(async (req: any, res: any) => {
  const collections = await Collection.find({ isActive: true })
    .populate('products', 'name images price discountedPrice slug rating brand')
    .sort('name');

  res.status(200).json(ApiResponse.success(collections));
});

const getCollection = asyncHandler(async (req: any, res: any) => {
  const collection = await Collection.findById(req.params.id)
    .populate('products', 'name images price discountedPrice slug rating brand category');

  if (!collection) {
    throw ApiError.notFound('Collection not found');
  }

  res.status(200).json(ApiResponse.success(collection));
});

const getCollectionBySlug = asyncHandler(async (req: any, res: any) => {
  const collection = await Collection.findOne({ slug: req.params.slug, isActive: true })
    .populate('products', 'name images price discountedPrice slug rating brand category');

  if (!collection) {
    throw ApiError.notFound('Collection not found');
  }

  res.status(200).json(ApiResponse.success(collection));
});

const createCollection = asyncHandler(async (req: any, res: any) => {
  const existing = await Collection.findOne({ name: req.body.name });
  if (existing) {
    throw ApiError.conflict('Collection with this name already exists');
  }

  const collection = await Collection.create(req.body);

  const populated = await Collection.findById(collection._id)
    .populate('products', 'name images price discountedPrice slug');

  res.status(201).json(ApiResponse.created(populated));
});

const updateCollection = asyncHandler(async (req: any, res: any) => {
  if (req.body.name) {
    const existing = await Collection.findOne({ name: req.body.name, _id: { $ne: req.params.id } });
    if (existing) {
      throw ApiError.conflict('Collection with this name already exists');
    }
  }

  const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('products', 'name images price discountedPrice slug');

  if (!collection) {
    throw ApiError.notFound('Collection not found');
  }

  res.status(200).json(ApiResponse.updated(collection));
});

const deleteCollection = asyncHandler(async (req: any, res: any) => {
  const collection = await Collection.findByIdAndDelete(req.params.id);

  if (!collection) {
    throw ApiError.notFound('Collection not found');
  }

  res.status(200).json(ApiResponse.deleted('Collection deleted successfully'));
});

const addProductsToCollection = asyncHandler(async (req: any, res: any) => {
  const { productIds } = req.body;

  const collection = await Collection.findById(req.params.id);
  if (!collection) {
    throw ApiError.notFound('Collection not found');
  }

  for (const productId of productIds) {
    if (!collection.products.includes(productId)) {
      collection.products.push(productId);
    }
  }

  await collection.save();

  const populated = await Collection.findById(collection._id)
    .populate('products', 'name images price discountedPrice slug');

  res.status(200).json(ApiResponse.updated(populated));
});

const removeProductsFromCollection = asyncHandler(async (req: any, res: any) => {
  const { productIds } = req.body;

  const collection = await Collection.findById(req.params.id);
  if (!collection) {
    throw ApiError.notFound('Collection not found');
  }

  collection.products = collection.products.filter(
    (p: any) => !productIds.includes(p.toString())
  );

  await collection.save();

  const populated = await Collection.findById(collection._id)
    .populate('products', 'name images price discountedPrice slug');

  res.status(200).json(ApiResponse.updated(populated));
});

module.exports = {
  getCollections,
  getActiveCollections,
  getCollection,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
  addProductsToCollection,
  removeProductsFromCollection,
};

export {};
