const mongoose = require('mongoose');

const smtpSchema = new mongoose.Schema({
  host: { type: String, default: '' },
  port: { type: Number, default: 587 },
  user: { type: String, default: '' },
  pass: { type: String, default: '' },
  fromEmail: { type: String, default: '' },
  fromName: { type: String, default: '' },
}, { _id: false });

const currencySchema = new mongoose.Schema({
  code: { type: String, default: 'USD' },
  symbol: { type: String, default: '$' },
  position: { type: String, enum: ['before', 'after'], default: 'before' },
  decimalPlaces: { type: Number, default: 2 },
  thousandSeparator: { type: String, default: ',' },
  decimalSeparator: { type: String, default: '.' },
}, { _id: false });

const taxSchema = new mongoose.Schema({
  rate: { type: Number, default: 0 },
  type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  includedInPrice: { type: Boolean, default: false },
}, { _id: false });

const shippingSchema = new mongoose.Schema({
  freeShippingThreshold: { type: Number, default: 200 },
  standardRate: { type: Number, default: 9.99 },
  expressRate: { type: Number, default: 24.99 },
  estimatedDelivery: { type: String, default: '5-7 business days' },
}, { _id: false });

const socialMediaSchema = new mongoose.Schema({
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  twitter: { type: String, default: '' },
  pinterest: { type: String, default: '' },
  youtube: { type: String, default: '' },
}, { _id: false });

const seoSchema = new mongoose.Schema({
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  ogImage: { type: String, default: '' },
}, { _id: false });

const analyticsSchema = new mongoose.Schema({
  googleAnalyticsId: { type: String, default: '' },
  facebookPixelId: { type: String, default: '' },
}, { _id: false });

const settingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: [true, 'Store name is required'],
      default: 'Scent Studio',
    },
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' },
    smtp: { type: smtpSchema, default: () => ({}) },
    currency: { type: currencySchema, default: () => ({}) },
    tax: { type: taxSchema, default: () => ({}) },
    shipping: { type: shippingSchema, default: () => ({}) },
    socialMedia: { type: socialMediaSchema, default: () => ({}) },
    seo: { type: seoSchema, default: () => ({}) },
    analytics: { type: analyticsSchema, default: () => ({}) },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;

export {};
