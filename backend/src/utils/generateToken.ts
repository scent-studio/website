const jwt = require('jsonwebtoken');
const env = require('../config/env');

interface TokenPayload {
  id: string;
  role: string;
}

const generateAuthToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE,
  });
};

const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRE,
  });
};

const verifyToken = (token: string, secret: string): any => {
  return jwt.verify(token, secret);
};

const sendTokenResponse = (user: any, statusCode: number, res: any): void => {
  const payload = { id: user._id.toString(), role: user.role };
  const authToken = generateAuthToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const options = {
    expires: new Date(Date.now() + env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  };

  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;

  res.status(statusCode).cookie('token', authToken, options).json({
    success: true,
    data: {
      user: userObj,
      token: authToken,
      refreshToken,
    },
  });
};

module.exports = {
  generateAuthToken,
  generateRefreshToken,
  verifyToken,
  sendTokenResponse,
};

export {};
