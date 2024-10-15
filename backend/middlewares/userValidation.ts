import { body, param} from 'express-validator';
// Validation for updating user profile
export const validateUpdateProfile = [
  body('displayName')
    .optional()
    .isString().withMessage('Display name must be a string')
    .isLength({min:2, max: 100 }).withMessage('Display name cannot exceed 100 characters and must be at least 2 characters long'),

  body('email')
    .optional()
    .isEmail().withMessage('Email must be valid'),

  body('password')
    .optional()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];

// Validation for adding a product to the cart
export const validateAddToCart = [
  body('productId')
    .exists().withMessage('Product ID is required')
    .isMongoId().withMessage('Product ID must be a valid MongoDB ObjectId'),

  body('size')
    .exists().withMessage('Size is required')
    .isString().withMessage('Size must be a string'),

  body('quantity')
    .optional()
    .isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
];

// Validation for removing a product from the cart
export const validateRemoveFromCart = [
  param('productId')
    .exists().withMessage('Product ID is required')
    .isMongoId().withMessage('Product ID must be a valid MongoDB ObjectId'),

  param('size')
    .exists().withMessage('Size is required')
    .isString().withMessage('Size must be a string'),
];

// Validation for adding an address
export const validateAddAddress = [
  body('street')
    .exists().withMessage('Street is required')
    .isString().withMessage('Street must be a string'),

  body('city')
    .exists().withMessage('City is required')
    .isString().withMessage('City must be a string'),

  body('state')
    .exists().withMessage('State is required')
    .isString().withMessage('State must be a string'),

  body('postalCode')
    .exists().withMessage('Postal code is required')
    .isString().withMessage('Postal code must be a string'),

  body('country')
    .exists().withMessage('Country is required')
    .isString().withMessage('Country must be a string'),
];
