import { Router } from 'express';
import { getProductById} from '../controllers/productController';

const router = Router();

// Product Routes
router.get('/:id', getProductById);

export default router;
