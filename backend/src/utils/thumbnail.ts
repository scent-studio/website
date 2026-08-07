const sharp = require('sharp');

const THUMB_WIDTH = 300;
const THUMB_QUALITY = 70;

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
