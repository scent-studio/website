const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/ApiError');

const storage = multer.memoryStorage();

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

  const urls: string[] = req.files.map((file: any) => {
    const base64 = file.buffer.toString('base64');
    return `data:${file.mimetype};base64,${base64}`;
  });

  res.status(200).json(ApiResponse.success({ urls }));
});

module.exports = { upload, uploadImages };
export {};
