const mongoose = require('mongoose');
require('dotenv').config();
const { generateThumbnail } = require('./utils/thumbnail');
const { syncProductCard } = require('./utils/syncProductCard');

(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  const Product = require('./models/Product');
  const HomeCache = require('./models/HomeCache');

  const products = await Product.find({})
    .populate('brand', 'name')
    .select(
      'name slug images thumbnail price discount discountedPrice sizes rating numReviews gender isNewArrival isBestSeller isGiftSet isVisible brand createdAt'
    );

  console.log(`Syncing ${products.length} product cards...`);

  let updated = 0;
  for (const product of products) {
    if (!product.thumbnail && product.images?.[0]) {
      product.thumbnail = await generateThumbnail(product.images[0]);
      await Product.updateOne({ _id: product._id }, { $set: { thumbnail: product.thumbnail } });
    }
    await syncProductCard(product);
    updated++;
    console.log(`  ${product.name}`);
  }

  await HomeCache.deleteOne({ _id: 'home' });

  console.log(`\nDone. Synced ${updated} product cards. Home cache cleared.`);
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});

export {};
