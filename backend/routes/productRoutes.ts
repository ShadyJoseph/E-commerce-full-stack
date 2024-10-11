import { Router } from 'express';
import { getProductById, searchProducts } from '../controllers/productController';

const router = Router();

// Product Routes
router.get('/:id', getProductById);
router.get('/search', searchProducts);

export default router;
