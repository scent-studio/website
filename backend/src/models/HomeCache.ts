const mongoose = require('mongoose');

const homeCacheSchema = new mongoose.Schema(
  {
    _id: { type: String, default: 'home' },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    builtAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const HomeCache = mongoose.model('HomeCache', homeCacheSchema);

module.exports = HomeCache;
export {};
