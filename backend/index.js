import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
// Import Routes
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import placesRoutes from './routes/placesRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import shippingRoutes from './routes/shippingRoutes.js';
import journalRoutes from './routes/journalRoutes.js';
import b2bRoutes from './routes/b2bRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import { startMonthlyEvaluation } from './lib/cron.js';
import { corsMiddleware, sanitizeError } from './lib/security.js';
import { logError, logInfo } from './lib/logger.js';


const app = express();

// Start Background Services
startMonthlyEvaluation();

// Middleware
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));

// Minimal request logging to keep production noise down.
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production' || req.path === '/api/health') {
    logInfo('http.request', { method: req.method, path: req.path });
  }
  next();
});

// FIX UNTUK VERCEL SERVERLESS: Mengembalikan awalan /api yang dipangkas Vercel
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  next();
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'fermion-backend',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/b2b', b2bRoutes);
app.use('/api/subscription', subscriptionRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  logError('http.unhandled_error', err, { method: req.method, path: req.path });
  res.status(500).json(sanitizeError(err));
});

// Base route for info
app.get('/', (req, res) => {
  res.json({ 
    name: 'Fermion Business Engine',
    status: 'online',
    health: '/api/health',
    version: '1.0',
  });
});

// Start server for local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Fermion Business Engine running on port ${PORT}`);
  });
}

// Export for Vercel Serverless
export default app;
