const mongoose = require('mongoose');
const slugify = require('slugify');

const productSizeSchema = new mongoose.Schema({
  size: { type: String, required: [true, 'Size is required'] },
  price: { type: Number, required: [true, 'Price is required'], min: 0 },
  stock: { type: Number, required: [true, 'Stock is required'], min: 0, default: 0 },
  sku: { type: String, required: [true, 'SKU is required'], unique: true },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    shortDescription: {
      type: String,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 10;
        },
        message: 'Cannot have more than 10 images',
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      default: null,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    discountedPrice: {
      type: Number,
      default: 0,
    },
    sizes: {
      type: [productSizeSchema],
      default: [],
    },
    concentration: {
      type: String,
      enum: ['EDP', 'EDT', 'Parfum', 'Cologne'],
      required: [true, 'Concentration is required'],
    },
    topNotes: {
      type: [String],
      default: [],
    },
    middleNotes: {
      type: [String],
      default: [],
    },
    baseNotes: {
      type: [String],
      default: [],
    },
    ingredients: [String],
    longevity: {
      type: String,
      enum: ['Very Poor', 'Poor', 'Moderate', 'Good', 'Very Good', 'Excellent'],
    },
    projection: {
      type: String,
      enum: ['Very Poor', 'Poor', 'Moderate', 'Good', 'Very Good', 'Excellent'],
    },
    sillage: {
      type: String,
      enum: ['Very Poor', 'Poor', 'Moderate', 'Good', 'Very Good', 'Excellent'],
    },
    season: {
      type: String,
      enum: ['Spring', 'Summer', 'Fall', 'Winter', 'All Seasons'],
    },
    occasion: {
      type: String,
      enum: ['Casual', 'Formal', 'Evening', 'Office', 'Special Occasion', 'Everyday', 'Romantic'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'unisex'],
      required: [true, 'Gender is required'],
    },
    tags: [String],
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isLimitedEdition: { type: Boolean, default: false },
    isGiftSet: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
    },
    numReviews: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    lowStockThreshold: { type: Number, default: 5 },
    metaTitle: String,
    metaDescription: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text', topNotes: 'text', middleNotes: 'text', baseNotes: 'text' });
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ isFeatured: 1, isTrending: 1, isBestSeller: 1, isNewArrival: 1 });

productSchema.pre('save', function (this: any, next: Function) {
  if (this.isModified('name') && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  if (this.discount && this.discount > 0) {
    this.discountedPrice = this.price - (this.price * this.discount) / 100;
  } else {
    this.discountedPrice = this.price;
  }

  next();
});

productSchema.virtual('isLowStock').get(function (this: any) {
  return this.stock <= this.lowStockThreshold;
});

productSchema.virtual('isOutOfStock').get(function (this: any) {
  return this.stock === 0;
});

productSchema.virtual('inStock').get(function (this: any) {
  return this.stock > 0;
});

productSchema.virtual('stockQuantity').get(function (this: any) {
  return this.stock;
});

productSchema.virtual('isActive').get(function (this: any) {
  return this.isVisible !== false;
});

productSchema.methods.updateRating = async function (this: any) {
  const Review = require('./Review');
  const stats = await Review.aggregate([
    { $match: { product: this._id, isApproved: true } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    this.rating = Math.round(stats[0].averageRating * 10) / 10;
    this.numReviews = stats[0].numReviews;
  } else {
    this.rating = 0;
    this.numReviews = 0;
  }

  await this.save();
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

export {};
