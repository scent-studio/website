const express = require('express');
const router = express.Router();
const {
  getBrands,
  getBrand,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
} = require('../controllers/brandController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createBrandRules, updateBrandRules } = require('../validators/brand');

router.get('/', getBrands);
router.get('/slug/:slug', getBrandBySlug);
router.get('/:id', getBrand);

router.use(protect, authorize('admin'));
router.post('/', createBrandRules, validate, createBrand);
router.put('/:id', updateBrandRules, validate, updateBrand);
router.delete('/:id', deleteBrand);

module.exports = router;

export {};
