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
import {
  validateUpdateProfile,
  validateAddToCart,
  validateRemoveFromCart,
  validateAddAddress,
  validateRequest,
} from '../middlewares/userValidation'; // Adjust the path as necessary

const router = Router();

// User Profile Routes
router.get('/profile', isJWTAuthenticated, getProfile);
router.put('/profile', isJWTAuthenticated, validateUpdateProfile, validateRequest, updateProfile);

// Cart Management
router.get('/cart', isJWTAuthenticated, viewCart);
router.post('/cart', isJWTAuthenticated, validateAddToCart, validateRequest, addToCart);
router.delete('/cart/:productId/:size', isJWTAuthenticated, validateRemoveFromCart, validateRequest, removeFromCart);

// Address Management
router.post('/address', isJWTAuthenticated, validateAddAddress, validateRequest, addAddress);

export default router;
