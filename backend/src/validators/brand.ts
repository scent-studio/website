const { body } = require('express-validator');

const createBrandRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Brand name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  body('logo')
    .optional()
    .isURL().withMessage('Logo must be a valid URL'),
];

const updateBrandRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  body('logo')
    .optional()
    .isURL().withMessage('Logo must be a valid URL'),
];

module.exports = { createBrandRules, updateBrandRules };

export {};
