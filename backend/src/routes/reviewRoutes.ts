const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  approveReview,
  rejectReview,
  getAllReviews,
} = require('../controllers/reviewController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createReviewRules, updateReviewRules } = require('../validators/review');

router.get('/product/:productId', optionalAuth, getProductReviews);
router.post('/product/:productId', protect, createReviewRules, validate, createReview);
router.put('/:id', protect, updateReviewRules, validate, updateReview);
router.delete('/:id', protect, deleteReview);

router.use(protect, authorize('admin'));
router.get('/', getAllReviews);
router.put('/:id/approve', approveReview);
router.put('/:id/reject', rejectReview);

module.exports = router;

export {};
