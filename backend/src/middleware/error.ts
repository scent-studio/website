const ApiError = require('../utils/ApiError');

const handleCastErrorDB = (err: any) => {
  const message = `Resource not found. Invalid ${err.path}: ${err.value}`;
  return new ApiError(404, message);
};

const handleDuplicateFieldsDB = (err: any) => {
  const field = Object.keys(err.keyValue)[0];
  const message = `Duplicate field value: ${field}. Please use another value.`;
  return new ApiError(409, message);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ApiError(400, message, errors);
};

const handleJWTError = () => {
  return new ApiError(401, 'Invalid token. Please log in again.');
};

const handleJWTExpiredError = () => {
  return new ApiError(401, 'Your token has expired. Please log in again.');
};

const errorHandler = (err: any, req: any, res: any, next: any) => {
  let error = { ...err, message: err.message, stack: err.stack };

  if (err.name === 'CastError') error = handleCastErrorDB(err);
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors || undefined,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });
};

module.exports = errorHandler;

export {};
