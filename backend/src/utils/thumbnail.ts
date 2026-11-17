const sharp = require('sharp');

// Cards render ~380-430px wide (up to 2x on retina), so 300px looked blurry.
const THUMB_WIDTH = 640;
const THUMB_QUALITY = 82;

const generateThumbnail = async (dataUrl: string): Promise<string | null> => {
  const match = /^data:(image\/[a-z+]+);base64,(.+)$/i.exec(dataUrl);
  if (!match) return null;

  try {
    const buffer = Buffer.from(match[2], 'base64');
    const result = await sharp(buffer)
      .rotate()
      .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
      .webp({ quality: THUMB_QUALITY })
      .toBuffer();

    return `data:image/webp;base64,${result.toString('base64')}`;
  } catch {
    return null;
  }
};

module.exports = { generateThumbnail };
export {};
