const mongoose = require('mongoose');
require('dotenv').config();
const { generateThumbnail } = require('./utils/thumbnail');

(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  const Product = require('./models/Product');

  const products = await Product.find({
    images: { $exists: true, $ne: [] },
    $or: [{ thumbnail: null }, { thumbnail: { $exists: false } }],
  }).select('name images thumbnail');

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
