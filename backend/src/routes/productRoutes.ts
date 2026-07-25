const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeatured,
  getTrending,
  getBestSellers,
  getNewArrivals,
  getRelated,
  searchProducts,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createProductRules, updateProductRules } = require('../validators/product');

router.get('/', getProducts);
router.get('/featured', getFeatured);
router.get('/trending', getTrending);
router.get('/best-sellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);
router.get('/search', searchProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id/related', getRelated);
router.get('/:id', getProduct);

router.use(protect, authorize('admin'));
router.post('/', createProductRules, validate, createProduct);
router.put('/:id', updateProductRules, validate, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;

export {};
