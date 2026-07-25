const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [3, 'Code must be at least 3 characters'],
      maxlength: [20, 'Code cannot exceed 20 characters'],
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: [true, 'Coupon type is required'],
    },
    value: {
      type: Number,
      required: [true, 'Coupon value is required'],
      min: [0, 'Value cannot be negative'],
    },
    minOrder: {
      type: Number,
      default: 0,
      min: [0, 'Minimum order cannot be negative'],
    },
    maxDiscount: {
      type: Number,
      default: 0,
      min: [0, 'Maximum discount cannot be negative'],
    },
    usageLimit: {
      type: Number,
      default: 0,
      min: [0, 'Usage limit cannot be negative'],
    },
    usageCount: {
      type: Number,
      default: 0,
      min: [0, 'Usage count cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
  },
  {
    timestamps: true,
  }
);

couponSchema.virtual('isExpired').get(function (this: any) {
  return this.expiresAt && new Date() > this.expiresAt;
});

couponSchema.virtual('isMaxedOut').get(function (this: any) {
  return this.usageLimit > 0 && this.usageCount >= this.usageLimit;
});

couponSchema.virtual('isValid').get(function (this: any) {
  return this.isActive && !this.isExpired && !this.isMaxedOut;
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;

export {};
