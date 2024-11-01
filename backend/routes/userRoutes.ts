import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  viewCart,
  addToCart,
  removeFromCart,
  addAddress,
} from '../controllers/userController';
import {isAuthenticated  } from '../middlewares/authValidation'; 
import {
  validateUpdateProfile,
  validateAddToCart,
  validateRemoveFromCart,
  validateAddAddress
} from '../middlewares/userValidation'; 
import validateRequest from '../middlewares/validateRequest';

const router = Router();

// User Profile Routes
router.get('/profile', isAuthenticated, getProfile);
router.put('/profile', isAuthenticated, validateUpdateProfile, validateRequest, updateProfile);

// Cart Management
router.get('/cart', isAuthenticated, viewCart);
router.post('/cart', isAuthenticated, validateAddToCart, validateRequest, addToCart);
router.delete('/cart/:productId/:size', isAuthenticated, validateRemoveFromCart, validateRequest, removeFromCart);

// Address Management
router.post('/address', isAuthenticated, validateAddAddress, validateRequest, addAddress);

export default router;
