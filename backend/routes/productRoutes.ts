import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { isAuthenticated, isAdmin } from '../middlewares/authValidation';
import { validateProduct, validateProductRequest } from '../middlewares/productValidation'; // Import validateProductRequest

const router = Router();

// Product Routes
router.get('/', getAllProducts); // Public - Get all products with pagination
router.get('/:id', getProductById); // Public - Get a single product by ID

// Admin-only routes
router.post('/', isAuthenticated, isAdmin, validateProduct, validateProductRequest, createProduct); // Admin - Create a new product
router.put('/:id', isAuthenticated, isAdmin, validateProduct, validateProductRequest, updateProduct); // Admin - Update a product
router.delete('/:id', isAuthenticated, isAdmin, deleteProduct); // Admin - Delete a product

export default router;
