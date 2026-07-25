const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required'],
  },
  size: {
    type: String,
    required: [true, 'Size is required'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    default: 1,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.methods.calculateTotal = function (): void {
  this.total = this.items.reduce((sum: number, item: any) => {
    return sum + item.price * item.quantity;
  }, 0);
};

cartSchema.pre('save', function (this: any, next: Function) {
  this.calculateTotal();
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;

export {};
