const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

const protect = async (req: any, res: any, next: any) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(ApiError.unauthorized('Not authorized to access this route'));
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(ApiError.unauthorized('User not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(ApiError.unauthorized('Not authorized to access this route'));
  }
};

const authorize = (...roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Not authorized to access this route'));
    }

    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission to perform this action'));
    }

    next();
  };
};

const optionalAuth = async (req: any, res: any, next: any) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // User not authenticated, continue anyway
  }

  next();
};

module.exports = { protect, authorize, optionalAuth };

export {};
