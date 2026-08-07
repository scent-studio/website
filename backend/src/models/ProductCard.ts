const mongoose = require('mongoose');

const productCardSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    name: String,
    slug: String,
    thumbnail: String,
    price: Number,
    discount: Number,
    discountedPrice: Number,
    sizes: [
      {
        size: String,
        price: Number,
        stock: Number,
        sku: String,
      },
    ],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    gender: String,
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isGiftSet: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
    brand: {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

productCardSchema.index({ isVisible: 1, isGiftSet: 1, createdAt: -1 });
productCardSchema.index({ isVisible: 1, isNewArrival: 1, createdAt: -1 });
productCardSchema.index({ isVisible: 1, isBestSeller: 1, createdAt: -1 });
productCardSchema.index({ isVisible: 1, gender: 1, createdAt: -1 });
productCardSchema.index({ isVisible: 1, isNewArrival: 1, 'sizes.size': 1, createdAt: -1 });

const ProductCard = mongoose.model('ProductCard', productCardSchema);

module.exports = ProductCard;
export {};
