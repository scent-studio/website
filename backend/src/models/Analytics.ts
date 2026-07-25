const mongoose = require('mongoose');

const topProductSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  views: { type: Number, default: 0 },
}, { _id: false });

const topCategorySchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  name: String,
  views: { type: Number, default: 0 },
}, { _id: false });

const analyticsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
      unique: true,
    },
    visitors: {
      type: Number,
      default: 0,
    },
    pageViews: {
      type: Number,
      default: 0,
    },
    pageViewsByRoute: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    uniqueVisitors: {
      type: Number,
      default: 0,
    },
    averageTimeOnSite: {
      type: Number,
      default: 0,
    },
    bounceRate: {
      type: Number,
      default: 0,
    },
    topProducts: [topProductSchema],
    topCategories: [topCategorySchema],
    sales: {
      type: Number,
      default: 0,
    },
    orders: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

analyticsSchema.index({ date: -1 });

analyticsSchema.statics.recordPageView = async function (route: string): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await this.findOneAndUpdate(
    { date: today },
    {
      $inc: { pageViews: 1, [`pageViewsByRoute.${route}`]: 1, visitors: 1 },
      $setOnInsert: { date: today },
    },
    { upsert: true }
  );
};

analyticsSchema.statics.recordSale = async function (amount: number): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await this.findOneAndUpdate(
    { date: today },
    {
      $inc: { sales: amount, orders: 1 },
      $setOnInsert: { date: today },
    },
    { upsert: true }
  );
};

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;

export {};
