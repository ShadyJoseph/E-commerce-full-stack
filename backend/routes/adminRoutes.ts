import { Router } from 'express';
import { manageUsers, manageProducts } from '../controllers/adminController';
import { isAdmin, isAuthenticated } from '../middlewares/authValidation';

const router = Router();

// Admin Management Routes
router.get('/users', isAuthenticated, isAdmin, manageUsers);
router.get('/products', isAuthenticated, isAdmin, manageProducts);

export default router;
