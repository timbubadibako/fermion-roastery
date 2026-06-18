import express from 'express';
import multer from 'multer';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, uploadProductImage } from '../controllers/productController.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin Routes (Should be protected in production)
router.post('/', createProduct);
router.post('/upload', upload.single('image'), uploadProductImage);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
