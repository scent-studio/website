const express = require('express');
const router = express.Router();

const { defaultLimiter, apiLimiter } = require('../middleware/rateLimiter');

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const brandRoutes = require('./brandRoutes');
const orderRoutes = require('./orderRoutes');
const couponRoutes = require('./couponRoutes');
const reviewRoutes = require('./reviewRoutes');
const cartRoutes = require('./cartRoutes');
const wishlistRoutes = require('./wishlistRoutes');
const bannerRoutes = require('./bannerRoutes');
const newsletterRoutes = require('./newsletterRoutes');
const contactRoutes = require('./contactRoutes');
const settingsRoutes = require('./settingsRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const blogRoutes = require('./blogRoutes');
const collectionRoutes = require('./collectionRoutes');
const uploadRoutes = require('./uploadRoutes');

router.use(defaultLimiter);

router.use('/auth', authRoutes);
router.use('/products', apiLimiter, productRoutes);
router.use('/categories', apiLimiter, categoryRoutes);
router.use('/brands', apiLimiter, brandRoutes);
router.use('/orders', apiLimiter, orderRoutes);
router.use('/coupons', apiLimiter, couponRoutes);
router.use('/reviews', apiLimiter, reviewRoutes);
router.use('/cart', apiLimiter, cartRoutes);
router.use('/wishlist', apiLimiter, wishlistRoutes);
router.use('/banners', apiLimiter, bannerRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/contact', contactRoutes);
router.use('/settings', apiLimiter, settingsRoutes);
router.use('/analytics', apiLimiter, analyticsRoutes);
router.use('/blogs', apiLimiter, blogRoutes);
router.use('/collections', apiLimiter, collectionRoutes);
router.use('/upload', apiLimiter, uploadRoutes);

router.get('/health', (req: any, res: any) => {
  res.status(200).json({
    success: true,
    message: 'Scent Studio API is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;

export {};
