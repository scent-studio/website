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
const { createCategoryRules, updateCategoryRules } = require('../validators/category');

router.get('/', getCategories);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', getCategory);

router.use(protect, authorize('admin'));
router.post('/', createCategoryRules, validate, createCategory);
router.put('/:id', updateCategoryRules, validate, updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;

export {};
