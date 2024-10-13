import { body, validationResult } from 'express-validator'; // Import validationResult
import validator from 'validator'; // Import validator
import { Request, Response, NextFunction } from 'express'; // Import necessary types
import { ProductCategory } from '../models/product';

export const validateProduct = [
  body('name')
    .notEmpty().withMessage('Product name is required')
    .isLength({ max: 100 }).withMessage('Product name cannot exceed 100 characters'),
  
  body('description')
    .notEmpty().withMessage('Product description is required')
    .isLength({ max: 500 }).withMessage('Product description cannot exceed 500 characters'),
  
  body('price')
    .isNumeric().withMessage('Product price must be a number')
    .isFloat({ min: 0 }).withMessage('Product price must be non-negative'),
  
  body('imageUrls')
    .isArray({ min: 1 }).withMessage('At least one image URL is required')
    .custom((value: string[]) => {
      value.forEach((url: string) => { // Specify type for url
        if (!validator.isURL(url)) {
          throw new Error('Image URL is invalid');
        }
      });
      return true;
    }),

  body('category')
    .notEmpty().withMessage('Product category is required')
    .isIn(Object.values(ProductCategory)).withMessage('Invalid product category'),
  
  body('availableSizes')
    .isArray().withMessage('Available sizes must be an array')
    .custom((value: { size: string; stock: number }[]) => { // Specify type for size
      value.forEach((size) => {
        if (!size.size || typeof size.stock !== 'number' || size.stock < 0) {
          throw new Error('Each size must have a valid size and non-negative stock');
        }
      });
      return true;
    }),
];

// Middleware to handle validation errors
export const validateProductRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
