const express = require('express');
const router = express.Router();
const {
  getCollections,
  getActiveCollections,
  getCollection,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
  addProductsToCollection,
  removeProductsFromCollection,
} = require('../controllers/collectionController');
const { protect, authorize } = require('../middleware/auth');

router.get('/active', getActiveCollections);
router.get('/', getCollections);
router.get('/slug/:slug', getCollectionBySlug);
router.get('/:id', getCollection);

router.use(protect, authorize('admin'));
router.post('/', createCollection);
router.put('/:id', updateCollection);
router.delete('/:id', deleteCollection);
router.put('/:id/products/add', addProductsToCollection);
router.put('/:id/products/remove', removeProductsFromCollection);

module.exports = router;

export {};
