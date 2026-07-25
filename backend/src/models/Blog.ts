const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSeoSchema = new mongoose.Schema({
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  ogImage: { type: String, default: '' },
}, { _id: false });

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    excerpt: {
      type: String,
      required: [true, 'Blog excerpt is required'],
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    image: {
      type: String,
      default: '',
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: Date,
    seo: {
      type: blogSeoSchema,
      default: () => ({ metaTitle: '', metaDescription: '' }),
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.pre('save', function (this: any, next: Function) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

blogSchema.index({ slug: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ isPublished: 1, publishedAt: -1 });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;

export {};
