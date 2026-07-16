import rateLimit from 'express-rate-limit';

// General rate limiter: 100 requests per 15 minutes per IP
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// Login/auth limiter: stricter to prevent brute force on /auth/login
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6,
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
