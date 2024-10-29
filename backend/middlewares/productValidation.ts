import { body, validationResult } from 'express-validator';
import validator from 'validator';
import { Request, Response, NextFunction } from 'express';
import { ProductCategory } from '../models/product';
import logger from '../utils/logger';

export const validateProduct = [
  // Name validation
  body('name')
    .notEmpty().withMessage('Product name is required')
    .trim()
    .escape()
    .isLength({ max: 100 }).withMessage('Product name cannot exceed 100 characters'),

  // Description validation
  body('description')
    .notEmpty().withMessage('Product description is required')
    .trim()
    .escape()
    .isLength({ max: 500 }).withMessage('Product description cannot exceed 500 characters'),

  // Price validation
  body('price')
    .notEmpty().withMessage('Product price is required')
    .isFloat({ min: 0 }).withMessage('Product price must be a non-negative number')
    .toFloat(),

  // Image URLs validation
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

  // Category validation
  body('category')
    .notEmpty().withMessage('Product category is required')
    .isIn(Object.values(ProductCategory)).withMessage('Invalid product category'),

  // Discount validation
  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100'),

  // Season validation
  body('season')
    .optional()
    .trim()
    .escape(),

  // Gender validation
  body('gender')
    .optional()
    .isIn(['men', 'women', 'unisex']).withMessage('Gender must be one of "men", "women", or "unisex"'),

  // Rating validation
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),

  // Colors and Sizes validation
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

// Middleware to handle validation errors with logging
export const validateProductRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn(`Product validation failed: ${JSON.stringify(errors.array())}`);
    return res.status(400).json({
      status: 'error',
      message: 'Product validation failed',
      errors: errors.array(),
    });
  }
  next();
};
