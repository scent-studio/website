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
  getHomeData,
  searchProducts,
  getProductImage,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { cacheMiddleware, clearCache } = require('../middleware/cache');
const { createProductRules, updateProductRules } = require('../validators/product');

router.get('/', cacheMiddleware(30 * 1000), getProducts);
router.get('/featured', cacheMiddleware(30 * 1000), getFeatured);
router.get('/trending', cacheMiddleware(30 * 1000), getTrending);
router.get('/best-sellers', cacheMiddleware(30 * 1000), getBestSellers);
router.get('/new-arrivals', cacheMiddleware(30 * 1000), getNewArrivals);
router.get('/home', cacheMiddleware(5 * 60 * 1000), getHomeData);
router.get('/search', cacheMiddleware(30 * 1000), searchProducts);
router.get('/image/:id/:index', getProductImage);
router.get('/slug/:slug', cacheMiddleware(30 * 1000), getProductBySlug);
router.get('/:id/related', cacheMiddleware(30 * 1000), getRelated);
router.get('/:id', cacheMiddleware(30 * 1000), getProduct);

router.use(protect, authorize('admin'));
router.post('/', createProductRules, validate, createProduct);
router.put('/:id', updateProductRules, validate, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;

export {};
