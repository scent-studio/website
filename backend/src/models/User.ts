const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const addressSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Address name is required'] },
  phone: { type: String, required: [true, 'Phone number is required'] },
  street: { type: String, required: [true, 'Street address is required'] },
  city: { type: String, required: [true, 'City is required'] },
  state: { type: String, required: [true, 'State is required'] },
  zip: { type: String, required: [true, 'ZIP code is required'] },
  country: { type: String, required: [true, 'Country is required'], default: 'Pakistan' },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'customer'],
      default: 'customer',
    },
    avatar: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    addresses: [addressSchema],
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (this: any, next: Function) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function (): string {
  return jwt.sign({ id: this._id, role: this.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE,
  });
};

userSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign({ id: this._id, role: this.role }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRE,
  });
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

export {};
