const express = require('express');
const router = express.Router();
const {
  subscribe,
  unsubscribe,
  getAllSubscribers,
  deleteSubscriber,
} = require('../controllers/newsletterController');
const { protect, authorize } = require('../middleware/auth');

router.post('/subscribe', subscribe);
router.get('/unsubscribe/:token', unsubscribe);

router.use(protect, authorize('admin'));
router.get('/', getAllSubscribers);
router.delete('/:id', deleteSubscriber);

module.exports = router;

export {};
