const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getWishlist = asyncHandler(async (req: any, res: any) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products', 'name images price discountedPrice slug rating brand');

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  }

  res.status(200).json(ApiResponse.success(wishlist));
});

const addToWishlist = asyncHandler(async (req: any, res: any) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
  } else {
    const added = wishlist.addProduct(productId);
    if (!added) {
      throw ApiError.badRequest('Product already in wishlist');
    }
    await wishlist.save();
  }

  const populatedWishlist = await Wishlist.findById(wishlist._id).populate('products', 'name images price discountedPrice slug rating brand');

  res.status(200).json(ApiResponse.success(populatedWishlist));
});

const removeFromWishlist = asyncHandler(async (req: any, res: any) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    throw ApiError.notFound('Wishlist not found');
  }

  const removed = wishlist.removeProduct(productId);
  if (!removed) {
    throw ApiError.notFound('Product not found in wishlist');
  }

  await wishlist.save();

  const populatedWishlist = await Wishlist.findById(wishlist._id).populate('products', 'name images price discountedPrice slug rating brand');

  res.status(200).json(ApiResponse.success(populatedWishlist));
});

const clearWishlist = asyncHandler(async (req: any, res: any) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    throw ApiError.notFound('Wishlist not found');
  }

  wishlist.products = [];
  await wishlist.save();

  res.status(200).json(ApiResponse.success(wishlist));
});

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};

export {};
