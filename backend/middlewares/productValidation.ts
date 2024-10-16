import { body, validationResult } from 'express-validator';
import validator from 'validator';
import { Request, Response, NextFunction } from 'express';
import { ProductCategory } from '../models/product';

// Product validation middleware
export const validateProduct = [
  body('name')
    .notEmpty().withMessage('Product name is required')
    .trim()
    .escape()
    .isLength({ max: 100 }).withMessage('Product name cannot exceed 100 characters'),

  body('description')
    .notEmpty().withMessage('Product description is required')
    .trim()
    .escape()
    .isLength({ max: 500 }).withMessage('Product description cannot exceed 500 characters'),

  body('price')
    .notEmpty().withMessage('Product price is required')
    .isFloat({ min: 0 }).withMessage('Product price must be a non-negative number')
    .toFloat(),

  body('imageUrls')
    .isArray({ min: 1 }).withMessage('At least one image URL is required')
    .custom((urls: string[]) => {
      urls.forEach((url) => {
        if (!validator.isURL(url)) {
          throw new Error(`Invalid URL: ${url}`);
        }
      });
      return true;
    }),

  body('category')
    .notEmpty().withMessage('Product category is required')
    .isIn(Object.values(ProductCategory)).withMessage('Invalid product category'),

  body('colors')
    .isArray().withMessage('Colors must be an array')
    .custom((colors: { color: string; availableSizes: { size: string; stock: number }[] }[]) => {
      colors.forEach(({ color, availableSizes }) => {
        if (!color || typeof color !== 'string') {
          throw new Error('Each color must be a valid color name as a string');
        }
        if (!Array.isArray(availableSizes) || availableSizes.length === 0) {
          throw new Error(`Available sizes must be a non-empty array for color ${color}`);
        }
        availableSizes.forEach(({ size, stock }) => {
          if (!size || typeof size !== 'string') {
            throw new Error('Each size must be a valid size as a string');
          }
          if (typeof stock !== 'number' || stock < 0) {
            throw new Error(`Stock for size ${size} must be a non-negative number`);
          }
        });
      });
      return true;
    }),
];

// Middleware to handle validation errors
export const validateProductRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Product validation failed',
      errors: errors.array(),
    });
  }
  next();
};
