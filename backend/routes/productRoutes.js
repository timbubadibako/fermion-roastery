import express from 'express';
import multer from 'multer';
import { verifyAuth, verifyAdmin } from '../middleware/authMiddleware.js';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, uploadProductImage } from '../controllers/productController.js';
import { validateProductPayload } from '../lib/security.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin Routes
router.post('/', verifyAuth, verifyAdmin, validateProductPayload, createProduct);
router.post('/upload', verifyAuth, verifyAdmin, upload.single('image'), uploadProductImage);
router.put('/:id', verifyAuth, verifyAdmin, validateProductPayload, updateProduct);
router.delete('/:id', verifyAuth, verifyAdmin, deleteProduct);

export default router;
