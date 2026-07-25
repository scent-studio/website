const { body } = require('express-validator');

const createCouponRules = [
  body('code')
    .trim()
    .notEmpty().withMessage('Coupon code is required')
    .isLength({ min: 3, max: 20 }).withMessage('Code must be between 3 and 20 characters')
    .isAlphanumeric().withMessage('Code must contain only letters and numbers'),
  body('type')
    .notEmpty().withMessage('Coupon type is required')
    .isIn(['percentage', 'fixed']).withMessage('Type must be percentage or fixed'),
  body('value')
    .notEmpty().withMessage('Value is required')
    .isFloat({ min: 0 }).withMessage('Value must be positive'),
  body('minOrder')
    .optional()
    .isFloat({ min: 0 }).withMessage('Minimum order must be non-negative'),
  body('maxDiscount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Maximum discount must be non-negative'),
  body('usageLimit')
    .optional()
    .isInt({ min: 0 }).withMessage('Usage limit must be non-negative'),
  body('expiresAt')
    .notEmpty().withMessage('Expiry date is required')
    .isISO8601().withMessage('Expiry date must be a valid date'),
];

const updateCouponRules = [
  body('code')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage('Code must be between 3 and 20 characters'),
  body('type')
    .optional()
    .isIn(['percentage', 'fixed']).withMessage('Type must be percentage or fixed'),
  body('value')
    .optional()
    .isFloat({ min: 0 }).withMessage('Value must be positive'),
  body('expiresAt')
    .optional()
    .isISO8601().withMessage('Expiry date must be a valid date'),
];

const validateCouponRules = [
  body('code')
    .trim()
    .notEmpty().withMessage('Coupon code is required'),
  body('subtotal')
    .optional()
    .isFloat({ min: 0 }).withMessage('Subtotal must be positive'),
];

module.exports = { createCouponRules, updateCouponRules, validateCouponRules };

export {};
