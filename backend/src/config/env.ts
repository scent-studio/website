const dotenv = require('dotenv');
dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRE: string;
  JWT_REFRESH_EXPIRE: string;
  JWT_COOKIE_EXPIRE: number;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_FROM_EMAIL: string;
  SMTP_FROM_NAME: string;
  FRONTEND_URL: string;
  CORS_ORIGIN: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX: number;
}

const validateEnv = (): EnvConfig => {
  if (!process.env.MONGODB_URI) {
    throw new Error('Environment variable MONGODB_URI is required');
  }

  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '5000', 10),
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/luxury-perfume',
    JWT_SECRET: process.env.JWT_SECRET || 'default-jwt-secret-change-in-production',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-in-production',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
    JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '30d',
    JWT_COOKIE_EXPIRE: parseInt(process.env.JWT_COOKIE_EXPIRE || '7', 10),
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '2525', 10),
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL || 'noreply@scentstudio.pk',
    SMTP_FROM_NAME: process.env.SMTP_FROM_NAME || 'Scent Studio',
FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  };
};

const env = validateEnv();

module.exports = env;

export {};
