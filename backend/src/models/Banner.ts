const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Banner title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    subtitle: {
      type: String,
      maxlength: [500, 'Subtitle cannot exceed 500 characters'],
      default: '',
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    image: {
      type: String,
      required: [true, 'Banner image is required'],
    },
    link: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['hero', 'promotional', 'collection'],
      required: [true, 'Banner type is required'],
      default: 'hero',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

bannerSchema.index({ type: 1, order: 1 });

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;

export {};
