import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);

// Base route for health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'online', 
    engine: 'Fermion Business Engine v1.0',
    services: ['ProductAPI', 'AuthSync', 'PaymentGateway', 'AdminPortal']
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Fermion Business Engine running on port ${PORT}`);
});

