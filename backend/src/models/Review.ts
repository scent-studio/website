const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    title: {
      type: String,
      required: [true, 'Review title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 5;
        },
        message: 'Cannot have more than 5 images',
      },
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

reviewSchema.post('save', async function (this: any) {
  const Product = require('./Product');
  const product = await Product.findById(this.product);
  if (product) {
    await product.updateRating();
  }
});

reviewSchema.post('findOneAndUpdate', async function (this: any) {
  const doc = await this.model.findOne(this.getFilter());
  if (doc) {
    const Product = require('./Product');
    const product = await Product.findById(doc.product);
    if (product) {
      await product.updateRating();
    }
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

export {};
