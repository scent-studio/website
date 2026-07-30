const { body } = require('express-validator');

const createProductRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 2, max: 200 }).withMessage('Name must be between 2 and 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),
  body('shortDescription')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Short description cannot exceed 500 characters'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid category ID'),
  body('brand')
    .optional()
    .isMongoId().withMessage('Invalid brand ID'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100'),
  body('gender')
    .notEmpty().withMessage('Gender is required')
    .isIn(['male', 'female', 'unisex']).withMessage('Gender must be male, female, or unisex'),
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('sizes')
    .optional()
    .isArray().withMessage('Sizes must be an array'),
  body('sizes.*.size')
    .optional()
    .notEmpty().withMessage('Size is required'),
  body('sizes.*.price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Size price must be positive'),
  body('sizes.*.stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Size stock must be non-negative'),
  body('sizes.*.sku')
    .optional()
    .notEmpty().withMessage('SKU is required'),
];

const updateProductRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 }).withMessage('Name must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100'),
  body('category')
    .optional()
    .isMongoId().withMessage('Invalid category ID'),
  body('brand')
    .optional()
    .isMongoId().withMessage('Invalid brand ID'),
];

module.exports = { createProductRules, updateProductRules };

export {};
