const cloudinary = require('cloudinary').v2;
const env = require('./env');

const configureCloudinary = (): void => {
  if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
    console.log('Cloudinary configured successfully');
  } else {
    console.warn('Cloudinary credentials not provided. Image upload will be disabled.');
  }
};

module.exports = { configureCloudinary, cloudinary };

export {};
