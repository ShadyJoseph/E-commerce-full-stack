import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  viewCart,
  addToCart,
  removeFromCart,
  addAddress,
} from '../controllers/userController';
import { isJWTAuthenticated } from '../middlewares/authValidation';

const router = Router();

// User Profile Routes
router.get('/profile', isJWTAuthenticated, getProfile);
router.put('/profile', isJWTAuthenticated, updateProfile);

// Cart Management
router.get('/cart', isJWTAuthenticated, viewCart);
router.post('/cart', isJWTAuthenticated, addToCart);
router.delete('/cart/:productId/:size', isJWTAuthenticated, removeFromCart);

// Address Management
router.post('/address', isJWTAuthenticated, addAddress);

export default router;
