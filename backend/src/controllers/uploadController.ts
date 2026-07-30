const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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

  const uploadDir = path.join(__dirname, '../../uploads/products');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const urls: string[] = [];

  for (const file of req.files) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `product-${uniqueSuffix}${ext}`;
    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, file.buffer);

    urls.push(`/uploads/products/${filename}`);
  }

  res.status(200).json(ApiResponse.success({ urls }));
});

module.exports = { upload, uploadImages };
export {};
