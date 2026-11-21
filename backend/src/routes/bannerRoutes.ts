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

// Public hero slider data: cached
router.get('/active', cacheMiddleware(5 * 60 * 1000), getActiveBanners);

// Admin list/detail: never cache, otherwise the admin panel keeps showing deleted/old banners
const noStore = (req: any, res: any, next: any) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('CDN-Cache-Control', 'no-store');
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
  next();
};
router.get('/', noStore, getBanners);
router.get('/:id', noStore, getBanner);

router.use(protect, authorize('admin'));
router.post('/', createBanner);
router.put('/:id', updateBanner);
router.delete('/:id', deleteBanner);

module.exports = router;

export {};
