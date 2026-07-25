const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required'],
  },
  name: { type: String, required: [true, 'Product name is required'] },
  image: { type: String, required: [true, 'Product image is required'] },
  size: { type: String, required: [true, 'Size is required'] },
  quantity: { type: Number, required: [true, 'Quantity is required'], min: 1 },
  price: { type: Number, required: [true, 'Price is required'], min: 0 },
});

const addressSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Address name is required'] },
  phone: { type: String, required: [true, 'Phone number is required'] },
  street: { type: String, required: [true, 'Street address is required'] },
  city: { type: String, required: [true, 'City is required'] },
  state: { type: String, required: [true, 'State is required'] },
  zip: { type: String, required: [true, 'ZIP code is required'] },
  country: { type: String, required: [true, 'Country is required'] },
});

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  date: { type: Date, default: Date.now },
  note: { type: String, default: '' },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    guestInfo: {
      name: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      phone: { type: String, trim: true },
    },
    isGuestOrder: {
      type: Boolean,
      default: false,
    },
    orderItems: {
      type: [orderItemSchema],
      required: [true, 'Order items are required'],
      validate: {
        validator: function (v: any[]) {
          return v.length > 0;
        },
        message: 'Order must have at least one item',
      },
    },
    shippingAddress: {
      type: addressSchema,
      required: [true, 'Shipping address is required'],
    },
    billingAddress: {
      type: addressSchema,
      required: [true, 'Billing address is required'],
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer', 'cash_on_delivery'],
      default: 'credit_card',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative'],
    },
    tax: {
      type: Number,
      required: [true, 'Tax is required'],
      default: 0,
      min: [0, 'Tax cannot be negative'],
    },
    shippingCost: {
      type: Number,
      required: [true, 'Shipping cost is required'],
      default: 0,
      min: [0, 'Shipping cost cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
    },
    total: {
      type: Number,
      required: [true, 'Total is required'],
      min: [0, 'Total cannot be negative'],
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'packed', 'shipped', 'delivering', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
    },
    statusHistory: [statusHistorySchema],
    trackingNumber: String,
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

orderSchema.pre('validate', function (this: any, next: Function) {
  if (!this.user && !this.guestInfo?.email) {
    return next(new Error('Either a user or guest email is required'));
  }
  this.isGuestOrder = !this.user;
  next();
});

orderSchema.pre('save', function (this: any, next: Function) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      date: new Date(),
    });
  }

  if (this.isModified('isPaid') && this.isPaid) {
    this.paidAt = new Date();
    this.paymentStatus = 'completed';
  }

  if (this.isModified('isDelivered') && this.isDelivered) {
    this.deliveredAt = new Date();
  }

  next();
});

orderSchema.virtual('orderStatus').get(function (this: any) {
  return this.status;
});

orderSchema.virtual('customerEmail').get(function (this: any) {
  if (this.user && typeof this.user === 'object' && this.user.email) return this.user.email;
  return this.guestInfo?.email || '';
});

orderSchema.virtual('customerName').get(function (this: any) {
  if (this.user && typeof this.user === 'object' && this.user.name) return this.user.name;
  return this.guestInfo?.name || this.shippingAddress?.name || 'Guest';
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'orderItems.product': 1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

export {};
