import { Router } from 'express';
import { getProfile, updateProfile, viewCart, addToCart } from '../controllers/userController';
import { isAuthenticated } from '../middlewares/authValidation';

const router = Router();

// User Profile
router.get('/profile', isAuthenticated, getProfile);
router.put('/profile', isAuthenticated, updateProfile);

// User Cart
router.get('/cart', isAuthenticated, viewCart);
router.post('/cart/add', isAuthenticated, addToCart);

export default router;
