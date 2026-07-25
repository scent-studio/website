const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlog,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogsAdmin,
} = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getBlogs);
router.get('/admin/all', getAllBlogsAdmin);
router.get('/slug/:slug', getBlogBySlug);
router.get('/:id', getBlog);

router.use(protect, authorize('admin'));
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;

export {};
