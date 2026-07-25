const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      unique: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

wishlistSchema.methods.addProduct = function (productId: string): boolean {
  if (this.products.includes(productId)) {
    return false;
  }
  this.products.push(productId);
  return true;
};

wishlistSchema.methods.removeProduct = function (productId: string): boolean {
  const index = this.products.indexOf(productId);
  if (index === -1) {
    return false;
  }
  this.products.splice(index, 1);
  return true;
};

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;

export {};
