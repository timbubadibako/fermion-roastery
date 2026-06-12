import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';

/**
 * Rate Limiter for Contact Form
 * Max 3 submissions per IP per 15 minutes as per spec
 */
export const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  message: {
    message: "Too many inquiries from this IP, please try again after 15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Input Sanitization using express-validator
 */
export const validateInquiry = [
  body('full_name').trim().escape().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('message').trim().escape().notEmpty().withMessage('Message is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
