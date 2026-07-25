const { body } = require('express-validator');

const createCategoryRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('image')
    .optional()
    .isURL().withMessage('Image must be a valid URL'),
];

const updateCategoryRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('image')
    .optional()
    .isURL().withMessage('Image must be a valid URL'),
];

module.exports = { createCategoryRules, updateCategoryRules };

export {};
