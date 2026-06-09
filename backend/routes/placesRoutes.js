import express from 'express';
import { searchPlaces } from '../controllers/placesController.js';

const router = express.Router();

router.get('/search', searchPlaces);

export default router;
