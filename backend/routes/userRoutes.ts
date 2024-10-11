import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  viewCart,
  addToCart,
  removeFromCart,
} from '../controllers/userController';
import { isAuthenticated } from '../middlewares/authValidation';

const router = Router();

// User Profile
router.get('/profile', isAuthenticated, getProfile);
router.put('/profile', isAuthenticated, updateProfile);

// User Cart
router.get('/cart', isAuthenticated, viewCart);
router.post('/cart/add', isAuthenticated, addToCart);
router.delete('/cart/remove/:productId', isAuthenticated, removeFromCart); // New route for removing item from cart

export default router;
