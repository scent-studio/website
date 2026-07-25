const Blog = require('../models/Blog');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getBlogs = asyncHandler(async (req: any, res: any) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const { isPublished, tag } = req.query;

  const filter: any = {};

  if (isPublished !== undefined) {
    filter.isPublished = isPublished === 'true';
  } else {
    filter.isPublished = true;
  }

  if (tag) filter.tags = tag;

  const blogs = await Blog.find(filter)
    .skip(skip)
    .limit(limit)
    .sort('-publishedAt');

  const total = await Blog.countDocuments(filter);

  res.status(200).json(
    ApiResponse.success(blogs, undefined, total, {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    })
  );
});

const getBlog = asyncHandler(async (req: any, res: any) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw ApiError.notFound('Blog post not found');
  }

  res.status(200).json(ApiResponse.success(blog));
});

const getBlogBySlug = asyncHandler(async (req: any, res: any) => {
  const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true });

  if (!blog) {
    throw ApiError.notFound('Blog post not found');
  }

  res.status(200).json(ApiResponse.success(blog));
});

const createBlog = asyncHandler(async (req: any, res: any) => {
  const blog = await Blog.create({
    ...req.body,
    author: req.body.author || req.user.name,
  });

  res.status(201).json(ApiResponse.created(blog));
});

const updateBlog = asyncHandler(async (req: any, res: any) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!blog) {
    throw ApiError.notFound('Blog post not found');
  }

  res.status(200).json(ApiResponse.updated(blog));
});

const deleteBlog = asyncHandler(async (req: any, res: any) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);

  if (!blog) {
    throw ApiError.notFound('Blog post not found');
  }

  res.status(200).json(ApiResponse.deleted('Blog post deleted successfully'));
});

const getAllBlogsAdmin = asyncHandler(async (req: any, res: any) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const blogs = await Blog.find()
    .skip(skip)
    .limit(limit)
    .sort('-createdAt');

  const total = await Blog.countDocuments();

  res.status(200).json(
    ApiResponse.success(blogs, undefined, total, {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    })
  );
});

module.exports = {
  getBlogs,
  getBlog,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogsAdmin,
};

export {};
