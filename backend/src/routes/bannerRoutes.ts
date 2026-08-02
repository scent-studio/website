const express = require('express');
const router = express.Router();
const {
  getBanners,
  getActiveBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
} = require('../controllers/bannerController');
const { protect, authorize } = require('../middleware/auth');
const { cacheMiddleware } = require('../middleware/cache');

router.get('/active', cacheMiddleware(5 * 60 * 1000), getActiveBanners);
router.get('/', cacheMiddleware(5 * 60 * 1000), getBanners);
router.get('/:id', cacheMiddleware(5 * 60 * 1000), getBanner);

router.use(protect, authorize('admin'));
router.post('/', createBanner);
router.put('/:id', updateBanner);
router.delete('/:id', deleteBanner);

module.exports = router;

export {};
