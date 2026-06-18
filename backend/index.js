import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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

dotenv.config();

const app = express();

// Start Background Services
startMonthlyEvaluation();

// Middleware
app.use(cors());
app.use(express.json());

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
// Base route for health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'online', 
    engine: 'Fermion Business Engine v1.0',
    services: ['ProductAPI', 'AuthSync', 'PaymentGateway', 'AdminPortal', 'CartSync']
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Fermion Business Engine running on port ${PORT}`);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Fermion Business Engine running on port ${PORT}`);
});
