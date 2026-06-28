import crypto from 'crypto';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { body, query, validationResult } from 'express-validator';

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
];

const parseAllowedOrigins = () => {
  const raw = process.env.ALLOWED_FRONTEND_ORIGINS || process.env.ALLOWED_ORIGINS || '';
  const configured = raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  return Array.from(new Set([...DEFAULT_ALLOWED_ORIGINS, ...configured]));
};

const allowedOrigins = parseAllowedOrigins();

const sanitizePhoneNumber = (value) => String(value || '').replace(/[^\d+]/g, '');
const isValidPhoneNumber = (value) => {
  const digits = sanitizePhoneNumber(value).replace(/^\+/, '');
  return digits.length >= 9 && digits.length <= 15;
};

const normalizeSlug = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true,
});

const createLimiter = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message },
  });

export const contactRateLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: 'Terlalu banyak inquiry dari IP ini. Coba lagi dalam 15 menit.',
});

export const authRateLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: 'Terlalu banyak percobaan autentikasi. Coba lagi beberapa menit lagi.',
});

export const b2bRateLimiter = createLimiter({
  windowMs: 30 * 60 * 1000,
  max: 5,
  message: 'Terlalu banyak pengajuan B2B dari IP ini. Coba lagi nanti.',
});

export const webhookRateLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 120,
  message: 'Webhook rate limit exceeded.',
});

export const adminMutationRateLimiter = createLimiter({
  windowMs: 5 * 60 * 1000,
  max: 60,
  message: 'Terlalu banyak perubahan admin dalam waktu singkat.',
});

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Request tidak valid.',
      errors: errors.array().map(({ path, msg }) => ({ field: path, message: msg })),
    });
  }
  next();
};

export const validateInquiry = [
  body('full_name').trim().isLength({ min: 2, max: 120 }).withMessage('Nama lengkap wajib diisi.'),
  body('email').isEmail().normalizeEmail().withMessage('Email tidak valid.'),
  body('message').trim().isLength({ min: 10, max: 4000 }).withMessage('Pesan wajib diisi.'),
  handleValidation,
];

export const validateRegister = [
  body('email').isEmail().normalizeEmail().withMessage('Email tidak valid.'),
  body('password')
    .isLength({ min: 8 })
    .matches(/[A-Za-z]/)
    .matches(/[0-9]/)
    .withMessage('Password minimal 8 karakter dan harus mengandung huruf serta angka.'),
  body('fullName').trim().isLength({ min: 2, max: 120 }).withMessage('Nama lengkap wajib diisi.'),
  handleValidation,
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Email tidak valid.'),
  body('password').isString().notEmpty().withMessage('Password wajib diisi.'),
  handleValidation,
];

export const validateB2BRegistration = [
  body('profileId').isUUID().withMessage('Profile ID tidak valid.'),
  body('cafeName').trim().isLength({ min: 2, max: 160 }).withMessage('Nama usaha wajib diisi.'),
  body('cafeAddress').trim().isLength({ min: 10, max: 500 }).withMessage('Alamat usaha wajib diisi.'),
  body('phone')
    .custom(isValidPhoneNumber)
    .withMessage('Nomor telepon wajib menggunakan format yang valid.')
    .customSanitizer(sanitizePhoneNumber),
  body('volumeEstimate').optional().isFloat({ min: 0 }).withMessage('Estimasi volume tidak valid.'),
  handleValidation,
];

export const validateInvoicePayload = [
  body('amount').isFloat({ min: 0 }).withMessage('Nominal invoice tidak valid.'),
  body('items').isArray({ min: 1 }).withMessage('Item pesanan wajib diisi.'),
  body('customerDetails.name').trim().isLength({ min: 2, max: 120 }).withMessage('Nama pelanggan wajib diisi.'),
  body('customerDetails.email').isEmail().normalizeEmail().withMessage('Email pelanggan tidak valid.'),
  body('customerDetails.phone')
    .custom(isValidPhoneNumber)
    .withMessage('Nomor pelanggan tidak valid.')
    .customSanitizer(sanitizePhoneNumber),
  handleValidation,
];

export const validateShippingRates = [
  body('destination_area_id').optional().isString().isLength({ min: 3 }).withMessage('Area tujuan tidak valid.'),
  body('destination_postal_code')
    .optional()
    .trim()
    .matches(/^\d{5}$/)
    .withMessage('Kode pos harus terdiri dari 5 digit.'),
  body('items').isArray({ min: 1 }).withMessage('Item pengiriman wajib diisi.'),
  handleValidation,
];

export const validateSearchAreas = [
  query('input').optional().isLength({ min: 3, max: 120 }).withMessage('Minimal 3 karakter pencarian.'),
  handleValidation,
];

export const validateProductPayload = [
  body('name').trim().isLength({ min: 2, max: 200 }).withMessage('Nama produk wajib diisi.'),
  body('slug')
    .custom((value) => normalizeSlug(value).length >= 3)
    .withMessage('Slug produk minimal 3 karakter.')
    .customSanitizer(normalizeSlug),
  body('price_retail').isFloat({ min: 0 }).withMessage('Harga produk tidak valid.'),
  body('stock_quantity').isFloat({ min: 0 }).withMessage('Stok produk tidak valid.'),
  body('variants').optional().isArray().withMessage('Format varian tidak valid.'),
  handleValidation,
];

export const sanitizeError = (error, fallbackMessage = 'Internal Server Error') => ({
  message: fallbackMessage,
  error: process.env.NODE_ENV === 'development' ? error.message : undefined,
});

const timingSafeCompare = (actual, expected) => {
  const actualBuffer = Buffer.from(actual || '', 'utf8');
  const expectedBuffer = Buffer.from(expected || '', 'utf8');
  if (actualBuffer.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
};

export const verifyStaticWebhookSecret = (providedSecret, expectedSecret) => {
  if (!expectedSecret) return true;
  if (!providedSecret) return false;
  return timingSafeCompare(providedSecret, expectedSecret);
};

export const verifyWebhookHmac = ({ payload, signature, secret }) => {
  if (!secret) return true;
  if (!signature) return false;
  const digest = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return timingSafeCompare(signature, digest);
};
