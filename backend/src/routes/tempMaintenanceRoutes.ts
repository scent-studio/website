// TEMPORARY - remove after running the thumbnail regeneration once.
const express = require('express');
const router = express.Router();
const { regenerateThumbnails } = require('../controllers/tempMaintenanceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));
router.post('/regenerate-thumbnails', regenerateThumbnails);

module.exports = router;

export {};
