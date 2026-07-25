const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getDashboardStats,
  recordPageView,
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.post('/pageview', recordPageView);

router.use(protect, authorize('admin'));
router.get('/', getAnalytics);
router.get('/dashboard', getDashboardStats);

module.exports = router;

export {};
