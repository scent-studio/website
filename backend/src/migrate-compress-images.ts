const mongoose = require('mongoose');
const sharp = require('sharp');
require('dotenv').config();

const MAX_WIDTH = 1000;
const JPEG_QUALITY = 80;

const compressDataUrl = async (dataUrl: string): Promise<string> => {
  const match = /^data:(image\/[a-z+]+);base64,(.+)$/i.exec(dataUrl);
  if (!match) return dataUrl;
  const mime = match[1];
  const buffer = Buffer.from(match[2], 'base64');
  try {
    let pipeline = sharp(buffer).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true });
    if (mime === 'image/png' || mime === 'image/webp') {
      pipeline = pipeline.webp({ quality: JPEG_QUALITY });
    } else {
      pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
    }
    const result = await pipeline.toBuffer();
    if (result.length >= buffer.length) return dataUrl;
    const outMime = /webp|png/.test(mime) ? 'image/webp' : 'image/jpeg';
    return `data:${outMime};base64,${result.toString('base64')}`;
  } catch {
    return dataUrl;
  }
};

(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  const coll = mongoose.connection.db.collection('products');

  const products = await coll.find({ images: { $exists: true, $ne: [] } }).toArray();
  let beforeBytes = 0;
  let afterBytes = 0;
  let changed = 0;

  for (const product of products) {
    const before = JSON.stringify(product.images).length;
    beforeBytes += before;
    let modified = false;
    const newImages: string[] = [];
    for (const img of product.images || []) {
      const out = await compressDataUrl(img);
      newImages.push(out);
      if (out !== img) modified = true;
    }
    const after = JSON.stringify(newImages).length;
    afterBytes += after;
    if (modified) {
      await coll.updateOne({ _id: product._id }, { $set: { images: newImages } });
      changed++;
      console.log(`${String(product.name).padEnd(24)} ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`);
    } else {
      console.log(`${String(product.name).padEnd(24)} unchanged (${(before / 1024).toFixed(0)}KB)`);
    }
  }

  console.log(`\nUpdated ${changed} products.`);
  console.log(`Total images: ${(beforeBytes / 1024 / 1024).toFixed(2)}MB -> ${(afterBytes / 1024 / 1024).toFixed(2)}MB`);
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});

export {};
