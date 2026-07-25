const express = require('express');
const router = express.Router();
const {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createCouponRules, updateCouponRules, validateCouponRules } = require('../validators/coupon');

router.post('/validate', protect, validateCouponRules, validate, validateCoupon);

router.use(protect, authorize('admin'));
router.get('/', getCoupons);
router.get('/:id', getCoupon);
router.post('/', createCouponRules, validate, createCoupon);
router.put('/:id', updateCouponRules, validate, updateCoupon);
router.delete('/:id', deleteCoupon);

module.exports = router;

export {};
