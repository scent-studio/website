const { body } = require('express-validator');

const createReviewRules = [
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title')
    .trim()
    .notEmpty().withMessage('Review title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('comment')
    .trim()
    .notEmpty().withMessage('Review comment is required')
    .isLength({ max: 2000 }).withMessage('Comment cannot exceed 2000 characters'),
  body('images')
    .optional()
    .isArray({ max: 5 }).withMessage('Cannot have more than 5 images'),
];

const updateReviewRules = [
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Comment cannot exceed 2000 characters'),
];

module.exports = { createReviewRules, updateReviewRules };

export {};
