const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { cacheMiddleware } = require('../middleware/cache');
const { createCategoryRules, updateCategoryRules } = require('../validators/category');

router.get('/', cacheMiddleware(5 * 60 * 1000), getCategories);
router.get('/slug/:slug', cacheMiddleware(5 * 60 * 1000), getCategoryBySlug);
router.get('/:id', cacheMiddleware(5 * 60 * 1000), getCategory);

router.use(protect, authorize('admin'));
router.post('/', createCategoryRules, validate, createCategory);
router.put('/:id', updateCategoryRules, validate, updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;

export {};
