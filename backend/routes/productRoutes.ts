import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductCategories

} from '../controllers/productController';
import { isAuthenticated, isAdmin } from '../middlewares/authValidation';
import { validateProduct } from '../middlewares/productValidation'; 
import validateRequest from '../middlewares/validateRequest';

const router = Router();

// Product Routes
router.get('/categories', getProductCategories); // Place this route before `/:id`
router.get('/', getAllProducts); // Public - Get all products with pagination
router.get('/:id', getProductById); // Public - Get a single product by ID

// Admin-only routes
router.post('/', isAuthenticated, isAdmin, validateProduct, validateRequest, createProduct); // Admin - Create a new product
router.put('/:id', isAuthenticated, isAdmin, validateProduct, validateRequest, updateProduct); // Admin - Update a product
router.delete('/:id', isAuthenticated, isAdmin, deleteProduct); // Admin - Delete a product


export default router;
