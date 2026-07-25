const cloudinary = require('cloudinary').v2;
const { configureCloudinary } = require('../config/cloudinary');

configureCloudinary();

interface UploadOptions {
  folder?: string;
  public_id?: string;
  transformation?: any[];
  quality?: string;
  width?: number;
  height?: number;
  crop?: string;
}

const uploadToCloudinary = async (filePath: string, options?: UploadOptions): Promise<any> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: options?.folder || 'luxury-perfume',
      public_id: options?.public_id,
      transformation: options?.transformation,
      quality: options?.quality || 'auto',
      resource_type: 'auto',
    });

    return {
      publicId: result.public_id,
      url: result.secure_url,
      originalName: result.original_filename,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    };
  } catch (error: any) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error: any) {
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

const uploadMultipleToCloudinary = async (filePaths: string[], options?: UploadOptions): Promise<any[]> => {
  const uploadPromises = filePaths.map((filePath) =>
    uploadToCloudinary(filePath, options)
  );
  return Promise.all(uploadPromises);
};

const getOptimizedUrl = (publicId: string, options?: { width?: number; height?: number; quality?: string }): string => {
  return cloudinary.url(publicId, {
    width: options?.width || 800,
    height: options?.height || 800,
    quality: options?.quality || 'auto',
    fetch_format: 'auto',
    crop: 'fill',
  });
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  uploadMultipleToCloudinary,
  getOptimizedUrl,
};

export {};
