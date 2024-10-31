import { body, param } from 'express-validator';

// Validation for updating user profile
export const validateUpdateProfile = [
  body('displayName')
    .optional()
    .trim()
    .escape()
    .isString().withMessage('Display name must be a string')
    .isLength({ min: 2, max: 100 }).withMessage('Display name must be between 2 and 100 characters long'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Email must be valid')
    .normalizeEmail(),

  body('password')
    .optional()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter'),
];

// Validation for adding a product to the cart
export const validateAddToCart = [
  body('productId')
    .exists().withMessage('Product ID is required')
    .isMongoId().withMessage('Product ID must be a valid MongoDB ObjectId'),

  body('color')
    .optional()
    .isString().withMessage('Color must be a string')
    .trim()
    .escape(),

  body('size')
    .exists().withMessage('Size is required')
    .isString().withMessage('Size must be a string')
    .trim()
    .escape(),

  body('quantity')
    .exists().withMessage('Quantity is required') // Ensure quantity is required
    .isInt({ gt: 0 }).withMessage('Quantity must be a positive integer')
    .toInt(),
];

// Validation for removing a product from the cart
export const validateRemoveFromCart = [
  param('productId')
    .exists().withMessage('Product ID is required')
    .isMongoId().withMessage('Product ID must be a valid MongoDB ObjectId'),

  param('size')
    .exists().withMessage('Size is required')
    .isString().withMessage('Size must be a string')
    .trim()
    .escape(),
];

// Validation for adding an address
export const validateAddAddress = [
  body('street')
    .exists().withMessage('Street is required')
    .isString().withMessage('Street must be a string')
    .trim()
    .escape()
    .isLength({ min: 3 }).withMessage('Street must be at least 3 characters long'),

  body('city')
    .exists().withMessage('City is required')
    .isString().withMessage('City must be a string')
    .trim()
    .escape(),

  body('state')
    .exists().withMessage('State is required')
    .isString().withMessage('State must be a string')
    .trim()
    .escape(),

  body('postalCode')
    .exists().withMessage('Postal code is required')
    .isString().withMessage('Postal code must be a string')
    .trim()
    .escape(),

  body('country')
    .exists().withMessage('Country is required')
    .isString().withMessage('Country must be a string')
    .trim()
    .escape(),
];
