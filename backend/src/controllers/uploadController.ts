const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/ApiError');
const sharp = require('sharp');

const storage = multer.memoryStorage();

const MAX_WIDTH = 1000;
const JPEG_QUALITY = 80;
const COMPRESSIBLE = new Set(['image/jpeg', 'image/png', 'image/webp']);

const compressImage = async (
  buffer: Buffer,
  mimeType: string,
  maxWidth: number = MAX_WIDTH,
  quality: number = JPEG_QUALITY
): Promise<{ buffer: Buffer; mimeType: string }> => {
  if (!COMPRESSIBLE.has(mimeType)) return { buffer, mimeType };
  try {
    let pipeline = sharp(buffer)
      .rotate()
      .resize({ width: maxWidth, withoutEnlargement: true });

    const toWebp = mimeType === 'image/png' || mimeType === 'image/webp';
    if (toWebp) {
      pipeline = pipeline.webp({ quality });
    } else {
      pipeline = pipeline.jpeg({ quality, mozjpeg: true });
    }

    const result = await pipeline.toBuffer();
    if (result.length >= buffer.length) return { buffer, mimeType };
    return { buffer: result, mimeType: toWebp ? 'image/webp' : 'image/jpeg' };
  } catch {
    return { buffer, mimeType };
  }
};

const fileFilter = (req: any, file: any, cb: any) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new ApiError(400, 'Only JPEG, PNG, WebP, GIF images allowed'), false);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

const uploadImages = asyncHandler(async (req: any, res: any) => {
  if (!req.files || req.files.length === 0) {
    throw ApiError.badRequest('No images uploaded');
  }

  const urls: string[] = [];
  for (const file of req.files) {
    const { buffer, mimeType } = await compressImage(file.buffer, file.mimetype);
    const base64 = buffer.toString('base64');
    urls.push(`data:${mimeType};base64,${base64}`);
  }

  res.status(200).json(ApiResponse.success({ urls }));
});

// Hero banners need more resolution than product photos (full-width on desktop)
const BANNER_MAX_WIDTH = 1920;
const BANNER_QUALITY = 82;

const uploadBanner = asyncHandler(async (req: any, res: any) => {
  if (!req.file) {
    throw ApiError.badRequest('No image uploaded');
  }
  const { buffer, mimeType } = await compressImage(
    req.file.buffer,
    req.file.mimetype,
    BANNER_MAX_WIDTH,
    BANNER_QUALITY
  );
  const url = `data:${mimeType};base64,${buffer.toString('base64')}`;
  res.status(200).json(ApiResponse.success({ url }));
});

module.exports = { upload, uploadImages, uploadBanner };
export {};
