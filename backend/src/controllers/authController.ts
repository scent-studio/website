const crypto = require('crypto');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { sendTokenResponse, verifyToken } = require('../utils/generateToken');
const env = require('../config/env');
const { sendPasswordResetEmail, sendVerificationEmail } = require('../utils/sendEmail');

const register = asyncHandler(async (req: any, res: any) => {
  const { name, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict('User with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  const verificationToken = crypto.randomBytes(32).toString('hex');
  user.verificationToken = verificationToken;
  await user.save({ validateBeforeSave: false });

  const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;
  await sendVerificationEmail(user.email, verificationUrl).catch(() => {
    console.warn('Verification email could not be sent');
  });

  sendTokenResponse(user, 201, res);
});

const login = asyncHandler(async (req: any, res: any) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  sendTokenResponse(user, 200, res);
});

const logout = asyncHandler(async (req: any, res: any) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json(ApiResponse.message('Logged out successfully'));
});

const getMe = asyncHandler(async (req: any, res: any) => {
  const user = await User.findById(req.user._id);

  res.status(200).json(ApiResponse.success(user));
});

const updateProfile = asyncHandler(async (req: any, res: any) => {
  const { name, phone, avatar, addresses } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, avatar, addresses },
    { new: true, runValidators: true }
  );

  res.status(200).json(ApiResponse.updated(user));
});

const updatePassword = asyncHandler(async (req: any, res: any) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

const forgotPassword = asyncHandler(async (req: any, res: any) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.notFound('User with this email does not exist');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

  try {
    await sendPasswordResetEmail(user.email, resetUrl);
    res.status(200).json(ApiResponse.message('Password reset email sent'));
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw ApiError.internal('Email could not be sent');
  }
});

const resetPassword = asyncHandler(async (req: any, res: any) => {
  const { password } = req.body;
  const { token } = req.params;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw ApiError.badRequest('Invalid or expired reset token');
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

const verifyEmail = asyncHandler(async (req: any, res: any) => {
  const { token } = req.params;

  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    throw ApiError.badRequest('Invalid verification token');
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json(ApiResponse.message('Email verified successfully'));
});

const getAllUsers = asyncHandler(async (req: any, res: any) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find().skip(skip).limit(limit).sort('-createdAt');
  const total = await User.countDocuments();

  res.status(200).json(
    ApiResponse.success(users, undefined, total, {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    })
  );
});

const getUser = asyncHandler(async (req: any, res: any) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  res.status(200).json(ApiResponse.success(user));
});

const deleteUser = asyncHandler(async (req: any, res: any) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  res.status(200).json(ApiResponse.deleted('User deleted successfully'));
});

const updateUserRole = asyncHandler(async (req: any, res: any) => {
  const { role } = req.body;

  if (!['admin', 'customer'].includes(role)) {
    throw ApiError.badRequest('Invalid role');
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  res.status(200).json(ApiResponse.updated(user));
});

const refreshTokenHandler = asyncHandler(async (req: any, res: any) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw ApiError.badRequest('Refresh token is required');
  }

  try {
    const decoded = verifyToken(refreshToken, env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw ApiError.unauthorized('User not found');
    }
    sendTokenResponse(user, 200, res);
  } catch (error) {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshTokenHandler,
  getAllUsers,
  getUser,
  deleteUser,
  updateUserRole,
};

export {};
