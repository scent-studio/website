const express = require('express');
const router = express.Router();
const {
  submitContact,
  getAllMessages,
  getMessage,
  markAsRead,
  replyToMessage,
  deleteMessage,
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { contactLimiter } = require('../middleware/rateLimiter');
const { createContactRules, replyContactRules } = require('../validators/contact');

router.post('/', contactLimiter, createContactRules, validate, submitContact);

router.use(protect, authorize('admin'));
router.get('/', getAllMessages);
router.get('/:id', getMessage);
router.put('/:id/read', markAsRead);
router.put('/:id/reply', replyContactRules, validate, replyToMessage);
router.delete('/:id', deleteMessage);

module.exports = router;

export {};
