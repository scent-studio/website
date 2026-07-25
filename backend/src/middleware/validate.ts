const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validate = (req: any, res: any, next: any) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors: any[] = [];
    errors.array().forEach((err: any) => {
      extractedErrors.push({
        field: err.path,
        message: err.msg,
      });
    });

    const message = extractedErrors.map((e: any) => `${e.field}: ${e.message}`).join(', ');
    return next(ApiError.badRequest(message, extractedErrors));
  }

  next();
};

module.exports = validate;

export {};
