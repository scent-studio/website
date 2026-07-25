const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  registerRules,
  loginRules,
  updateProfileRules,
  updatePasswordRules,
  forgotPasswordRules,
  resetPasswordRules,
} = require('../validators/auth');

router.post('/register', authLimiter, registerRules, validate, register);
router.post('/login', authLimiter, loginRules, validate, login);
router.get('/logout', logout);
router.get('/verify-email/:token', verifyEmail);
router.post('/refresh', authLimiter, refreshTokenHandler);
router.post('/forgot-password', authLimiter, forgotPasswordRules, validate, forgotPassword);
router.put('/reset-password/:token', authLimiter, resetPasswordRules, validate, resetPassword);

router.use(protect);
router.get('/me', getMe);
router.put('/update-profile', updateProfileRules, validate, updateProfile);
router.put('/update-password', updatePasswordRules, validate, updatePassword);

router.use(authorize('admin'));
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);

module.exports = router;

export {};
