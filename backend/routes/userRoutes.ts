import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  viewCart,
  addToCart,
  removeFromCart,
  addAddress,
} from '../controllers/userController';
import { verifyJWTToken } from '../middlewares/authValidation'; // Adjust the path as necessary
import {
  validateUpdateProfile,
  validateAddToCart,
  validateRemoveFromCart,
  validateAddAddress,
  validateRequest,
} from '../middlewares/userValidation'; // Adjust the path as necessary

const router = Router();

// User Profile Routes
router.get('/profile', verifyJWTToken, getProfile);
router.put('/profile', verifyJWTToken, validateUpdateProfile, validateRequest, updateProfile);

// Cart Management
router.get('/cart', verifyJWTToken, viewCart);
router.post('/cart', verifyJWTToken, validateAddToCart, validateRequest, addToCart);
router.delete('/cart/:productId/:size', verifyJWTToken, validateRemoveFromCart, validateRequest, removeFromCart);

// Address Management
router.post('/address', verifyJWTToken, validateAddAddress, validateRequest, addAddress);

export default router;
