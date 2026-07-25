const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getCart = asyncHandler(async (req: any, res: any) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images price slug stock');

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [], total: 0 });
  }

  res.status(200).json(ApiResponse.success(cart));
});

const addToCart = asyncHandler(async (req: any, res: any) => {
  const { productId, size, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  if (!product.isVisible) {
    throw ApiError.badRequest('This product is not available');
  }

  let price = product.discountedPrice || product.price;

  const sizeInfo = product.sizes.find((s: any) => s.size === size);
  if (sizeInfo) {
    price = sizeInfo.price || price;
    if (sizeInfo.stock < quantity) {
      throw ApiError.badRequest('Insufficient stock');
    }
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
      total: 0,
    });
  }

  const existingItemIndex = cart.items.findIndex(
    (item: any) => item.product.toString() === productId && item.size === size
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
    cart.items[existingItemIndex].price = price;
  } else {
    cart.items.push({
      product: productId,
      size,
      quantity,
      price,
    });
  }

  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate('items.product', 'name images price slug stock');

  res.status(200).json(ApiResponse.success(populatedCart));
});

const updateCartItem = asyncHandler(async (req: any, res: any) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw ApiError.notFound('Cart not found');
  }

  const item = cart.items.id(itemId);
  if (!item) {
    throw ApiError.notFound('Item not found in cart');
  }

  item.quantity = quantity;
  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate('items.product', 'name images price slug stock');

  res.status(200).json(ApiResponse.success(populatedCart));
});

const removeFromCart = asyncHandler(async (req: any, res: any) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw ApiError.notFound('Cart not found');
  }

  cart.items = cart.items.filter((item: any) => item._id.toString() !== itemId);
  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate('items.product', 'name images price slug stock');

  res.status(200).json(ApiResponse.success(populatedCart));
});

const clearCart = asyncHandler(async (req: any, res: any) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw ApiError.notFound('Cart not found');
  }

  cart.items = [];
  await cart.save();

  res.status(200).json(ApiResponse.success(cart));
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};

export {};
