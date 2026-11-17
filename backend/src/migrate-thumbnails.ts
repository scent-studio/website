const mongoose = require('mongoose');
require('dotenv').config();
const { generateThumbnail } = require('./utils/thumbnail');

(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  const Product = require('./models/Product');

  // Pass --force to regenerate existing thumbnails (e.g. after changing size/quality)
  const force = process.argv.includes('--force');
  const filter: any = { images: { $exists: true, $ne: [] } };
  if (!force) filter.$or = [{ thumbnail: null }, { thumbnail: { $exists: false } }];

  const products = await Product.find(filter).select('name images thumbnail');

  console.log(`Generating thumbnails for ${products.length} products...`);

  let updated = 0;
  for (const product of products) {
    const thumb = await generateThumbnail(product.images[0]);
    if (thumb) {
      await Product.updateOne({ _id: product._id }, { $set: { thumbnail: thumb } });
      updated++;
      console.log(`  ${product.name} — ${(thumb.length / 1024).toFixed(1)}KB`);
    } else {
      console.log(`  ${product.name} — skipped (invalid image)`);
    }
  }

  console.log(`\nDone. Updated ${updated}/${products.length} products.`);
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});

export {};
