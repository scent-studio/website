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

router.get('/active', getActiveBanners);
router.get('/', getBanners);
router.get('/:id', getBanner);

router.use(protect, authorize('admin'));
router.post('/', createBanner);
router.put('/:id', updateBanner);
router.delete('/:id', deleteBanner);

module.exports = router;

export {};
