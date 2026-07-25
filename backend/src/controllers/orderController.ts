const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { sendOrderConfirmationEmail } = require('../utils/sendEmail');
const { getIO } = require('../lib/socket');

async function restoreStock(orderItems: any[]) {
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) continue;

    const sizeInfo = product.sizes.find((s: any) => s.size === item.size);
    if (sizeInfo) sizeInfo.stock += item.quantity;
    product.stock = (product.stock || 0) + item.quantity;
    product.totalSales = Math.max(0, (product.totalSales || 0) - item.quantity);
    await product.save();
  }
}

const createOrder = asyncHandler(async (req: any, res: any) => {
  const {
    orderItems,
    shippingAddress,
    billingAddress,
    paymentMethod,
    subtotal,
    tax,
    shippingCost,
    discount,
    total,
    coupon,
    guestInfo,
  } = req.body;

  const isGuest = !req.user;

  if (isGuest && !guestInfo?.phone) {
    throw ApiError.badRequest('Phone number is required to place a guest order');
  }

  const productsToUpdate: any[] = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw ApiError.notFound(`Product ${item.product} not found`);
    }

    const sizeInfo = product.sizes.find((s: any) => s.size === item.size);
    if (!sizeInfo) {
      throw ApiError.badRequest(`Size ${item.size} not available for ${product.name}`);
    }

    if (sizeInfo.stock < item.quantity) {
      throw ApiError.badRequest(`Insufficient stock for ${product.name} (${item.size})`);
    }

    productsToUpdate.push({ product, sizeInfo, quantity: item.quantity });
  }

  if (coupon) {
    const couponDoc = await Coupon.findById(coupon);
    if (couponDoc && couponDoc.isValid) {
      if (subtotal < couponDoc.minOrder) {
        throw ApiError.badRequest(`Minimum order amount of Rs. ${couponDoc.minOrder} required for this coupon`);
      }

      couponDoc.usageCount += 1;
      await couponDoc.save();
    }
  }

  const order = await Order.create({
    user: isGuest ? null : req.user._id,
    isGuestOrder: isGuest,
    guestInfo: isGuest
      ? {
          name: guestInfo.name || shippingAddress?.name || 'Guest',
          email: guestInfo.email,
          phone: guestInfo.phone || shippingAddress?.phone || '',
        }
      : undefined,
    orderItems,
    shippingAddress,
    billingAddress,
    paymentMethod,
    subtotal,
    tax,
    shippingCost,
    discount,
    total,
    coupon: coupon || undefined,
  });

  // Decrement both the per-size stock and the aggregate product stock
  for (const { product, sizeInfo, quantity } of productsToUpdate) {
    sizeInfo.stock = Math.max(0, sizeInfo.stock - quantity);
    product.stock = Math.max(0, (product.stock || 0) - quantity);
    product.totalSales = (product.totalSales || 0) + quantity;
    await product.save();
  }

  const confirmationEmail = isGuest ? guestInfo.email : req.user.email;
  sendOrderConfirmationEmail(confirmationEmail, order).catch(() => {
    console.warn('Order confirmation email could not be sent');
  });

  const populatedOrder = await Order.findById(order._id)
    .populate('orderItems.product', 'name images price')
    .populate('user', 'name email');

  const io = getIO();
  if (io) {
    io.to('admin').emit('newOrder', {
      _id: populatedOrder._id,
      customerName: populatedOrder.guestInfo?.name || populatedOrder.user?.name || 'Customer',
      total: populatedOrder.total,
      createdAt: populatedOrder.createdAt,
    });
  }

  res.status(201).json(ApiResponse.created(populatedOrder));
});

const getMyOrders = asyncHandler(async (req: any, res: any) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ user: req.user._id })
    .populate('orderItems.product', 'name images')
    .skip(skip)
    .limit(limit)
    .sort('-createdAt');

  const total = await Order.countDocuments({ user: req.user._id });

  res.status(200).json(
    ApiResponse.success(orders, undefined, total, {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    })
  );
});

const getOrderById = asyncHandler(async (req: any, res: any) => {
  const order = await Order.findById(req.params.id)
    .populate('orderItems.product', 'name images price slug')
    .populate('user', 'name email phone')
    .populate('coupon', 'code type value');

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  // Guest orders are reachable by anyone holding the order id; account orders
  // stay restricted to their owner and admins.
  if (order.user) {
    const ownerId = order.user._id ? order.user._id.toString() : order.user.toString();
    if (!req.user || (ownerId !== req.user._id.toString() && req.user.role !== 'admin')) {
      throw ApiError.forbidden('Not authorized to view this order');
    }
  }

  res.status(200).json(ApiResponse.success(order));
});

const cancelOrder = asyncHandler(async (req: any, res: any) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  if (order.user) {
    if (!req.user || (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')) {
      throw ApiError.forbidden('Not authorized to cancel this order');
    }
  }

  if (!['pending', 'confirmed'].includes(order.status)) {
    throw ApiError.badRequest('Order cannot be cancelled at this stage');
  }

  order.status = 'cancelled';
  await order.save();

  await restoreStock(order.orderItems);

  if (order.coupon) {
    const couponDoc = await Coupon.findById(order.coupon);
    if (couponDoc) {
      couponDoc.usageCount = Math.max(0, couponDoc.usageCount - 1);
      await couponDoc.save();
    }
  }

  res.status(200).json(ApiResponse.updated(order));
});

const getAllOrders = asyncHandler(async (req: any, res: any) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const { status, startDate, endDate, search } = req.query;

  const filter: any = {};
  if (status) filter.status = status;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate as string);
    if (endDate) filter.createdAt.$lte = new Date(endDate as string);
  }

  if (search) {
    const term = String(search).trim();
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const or: any[] = [
      { 'guestInfo.name': regex },
      { 'guestInfo.email': regex },
      { 'shippingAddress.name': regex },
    ];
    if (mongoose.Types.ObjectId.isValid(term)) {
      or.push({ _id: term });
    }
    filter.$or = or;
  }

  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name images')
    .skip(skip)
    .limit(limit)
    .sort('-createdAt');

  const total = await Order.countDocuments(filter);

  res.status(200).json(
    ApiResponse.success(orders, undefined, total, {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    })
  );
});

const updateOrderStatus = asyncHandler(async (req: any, res: any) => {
  const { status, note } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  const validTransitions: any = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['packed', 'cancelled'],
    packed: ['shipped'],
    shipped: ['delivering'],
    delivering: ['delivered'],
    delivered: ['refunded'],
    cancelled: [],
    refunded: [],
  };

  if (!validTransitions[order.status].includes(status)) {
    throw ApiError.badRequest(`Cannot transition from ${order.status} to ${status}`);
  }

  order.status = status;

  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }

  if (status === 'refunded' || status === 'cancelled') {
    await restoreStock(order.orderItems);
  }

  if (note) {
    const history = order.statusHistory[order.statusHistory.length - 1];
    if (history) {
      history.note = note;
    }
  }

  await order.save();

  res.status(200).json(ApiResponse.updated(order));
});

const updatePaymentStatus = asyncHandler(async (req: any, res: any) => {
  const { paymentStatus, paymentResult } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  order.paymentStatus = paymentStatus;
  if (paymentResult) {
    order.paymentResult = paymentResult;
  }

  if (paymentStatus === 'completed') {
    order.isPaid = true;
    order.paidAt = new Date();
  }

  await order.save();

  res.status(200).json(ApiResponse.updated(order));
});

const claimGuestOrders = asyncHandler(async (req: any, res: any) => {
  const email = req.user.email;
  if (!email) {
    return res.status(200).json(ApiResponse.success({ claimed: 0 }));
  }

  const result = await Order.updateMany(
    { user: null, isGuestOrder: true, 'guestInfo.email': email },
    { $set: { user: req.user._id, isGuestOrder: false } }
  );

  res.status(200).json(ApiResponse.success({ claimed: result.modifiedCount }));
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  claimGuestOrders,
};

export {};
