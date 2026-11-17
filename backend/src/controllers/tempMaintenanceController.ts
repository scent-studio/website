// TEMPORARY: one-off thumbnail regeneration triggered from the admin panel.
// Delete this file, tempMaintenanceRoutes.ts and the frontend TempThumbnailRegenerator once done.
const mongoose = require('mongoose');
const Product = require('../models/Product');
const HomeCache = require('../models/HomeCache');
const { generateThumbnail } = require('../utils/thumbnail');
const { syncProductCard } = require('../utils/syncProductCard');
const asyncHandler = require('../utils/asyncHandler');

const BATCH_SIZE = 3;

// POST body: { afterId?: string }  -> processes the next batch after that _id
const regenerateThumbnails = asyncHandler(async (req: any, res: any) => {
  const afterId: string | undefined = req.body?.afterId;
  const match: any = { 'images.0': { $exists: true } };
  if (afterId) match._id = { $gt: new mongoose.Types.ObjectId(afterId) };

  const total = await Product.countDocuments({ 'images.0': { $exists: true } });

  // Only pull the first image (full image arrays can be large)
  const batch = await Product.aggregate([
    { $match: match },
    { $sort: { _id: 1 } },
    { $limit: BATCH_SIZE },
    { $project: { name: 1, first: { $arrayElemAt: ['$images', 0] } } },
  ]);

  const results: { name: string; status: string }[] = [];
  for (const item of batch) {
    const thumb = await generateThumbnail(item.first);
    if (!thumb) {
      results.push({ name: item.name, status: 'skipped (invalid image)' });
      continue;
    }
    await Product.updateOne({ _id: item._id }, { $set: { thumbnail: thumb } });
    const full = await Product.findById(item._id)
      .populate('brand', 'name')
      .select(
        'name slug thumbnail price discount discountedPrice sizes rating numReviews gender isNewArrival isBestSeller isGiftSet isVisible brand createdAt'
      );
    if (full) await syncProductCard(full);
    results.push({ name: item.name, status: `ok (${(thumb.length / 1024).toFixed(0)}KB)` });
  }

  const done = batch.length < BATCH_SIZE;
  if (done) await HomeCache.deleteOne({ _id: 'home' });

  res.status(200).json({
    success: true,
    total,
    processed: batch.length,
    results,
    nextAfterId: batch.length ? String(batch[batch.length - 1]._id) : null,
    done,
  });
});

module.exports = { regenerateThumbnails };
export {};
