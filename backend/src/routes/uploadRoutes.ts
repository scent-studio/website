const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { upload, uploadImages } = require('../controllers/uploadController');

router.use(protect, authorize('admin'));
router.post('/', upload.array('images', 5), uploadImages);

module.exports = router;

export {};
