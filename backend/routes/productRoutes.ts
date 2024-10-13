import { Router } from 'express';
import expressValidator from 'express-validator'; // Corrected import for express-validator
const { body } = expressValidator;
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { isAuthenticated, isAdmin } from '../middlewares/authValidation';

const router = Router();

// Input validation for product creation and updating
const validateProduct = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isNumeric().withMessage('Product price must be a number'),
  body('category').notEmpty().withMessage('Product category is required'),
];

// Product Routes
router.get('/', getAllProducts); // Public - Get all products with pagination
router.get('/:id', getProductById); // Public - Get a single product by ID

// Admin-only routes
router.post('/', isAuthenticated, isAdmin, validateProduct, createProduct); // Admin - Create a new product
router.put('/:id', isAuthenticated, isAdmin, validateProduct, updateProduct); // Admin - Update a product
router.delete('/:id', isAuthenticated, isAdmin, deleteProduct); // Admin - Delete a product

export default router;
