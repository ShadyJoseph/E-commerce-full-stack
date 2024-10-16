import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import User, { IUser } from '../models/user';
import { body, validationResult } from 'express-validator';
import { isTokenBlacklisted } from '../utils/blacklistToken';

// Utility function for logging
const logAuthAttempt = (req: Request, user: IUser | null, isSuccess: boolean) => {
  const userIdentifier = user ? user.email || user.displayName : 'unknown';
  const status = isSuccess ? 'granted' : 'denied';
  logger.info(`Authentication ${status} for user ${userIdentifier} at ${req.originalUrl}`);
};

// Middleware to check if user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user) {
    logAuthAttempt(req, req.user as IUser, true);
    return next();
  } else {
    logger.warn('Session-based authentication failed. Checking JWT...');
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    logger.info('JWT token found. Proceeding with JWT authentication.');
    return verifyJWTToken(req, res, next);
  } else {
    logger.warn('No JWT token found in request.');
  }

  logger.warn(`Unauthorized access attempt to ${req.originalUrl}`);
  return res.status(401).json({ message: 'You must be logged in to access this route' });
};
// Middleware to verify JWT token
export const verifyJWTToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  // Check if token is provided
  if (!token) {
    logger.warn(`No token provided for request to ${req.originalUrl}`);
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Check if token is blacklisted
  if (isTokenBlacklisted(token)) {
    logger.warn(`Blacklisted token used to access ${req.originalUrl}`);
    return res.status(401).json({ message: 'Token has been invalidated. Please log in again.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    logger.info(`Decoded JWT token: ${JSON.stringify(decoded)}`);

    // Find the user by ID from the decoded token
    const user = await User.findById(decoded.userId);
    if (!user) {
      logger.warn(`Invalid token used to access ${req.originalUrl}`);
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Attach the user to the request object for further processing
    req.user = user;
    logAuthAttempt(req, user, true); // Log successful authentication
    next();
  } catch (error) {
    // Handle token-related errors
    handleTokenError(res, error, req.originalUrl);
  }
};

// Error handling for token verification
const handleTokenError = (res: Response, error: any, url: string) => {
  if (error instanceof jwt.TokenExpiredError) {
    logger.warn(`Expired JWT token used to access ${url}`);
    return res.status(401).json({ message: 'Token expired, please log in again' });
  }

  logger.error(`JWT validation error: ${error}`);
  return res.status(401).json({ message: 'Invalid token' });
};


// Middleware to check if user is admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUser;
  if (user && user.role === 'admin') {
    logAuthAttempt(req, user, true);
    return next();
  }

  logger.warn(`Admin access denied to user ${user?.email || 'unknown'} at ${req.originalUrl}`);
  return res.status(403).json({ message: 'You do not have permission to access this route' });
};

// Unified middleware to require authentication
export const requireAuthentication = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return isAuthenticated(req, res, next);
  }
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    return verifyJWTToken(req, res, next);
  }
  return res.status(401).json({ message: 'Authentication required' });
};

export const validateUserSignUp = [
  body('displayName')
    .exists().withMessage('Display name is required')
    .isString().withMessage('Display name must be a string')
    .trim()
    .escape()
    .isLength({ max: 100 }).withMessage('Display name cannot exceed 100 characters'),

  body('email')
    .exists().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .exists().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter'),
];

// User login validation middleware
export const validateUserLogin = [
  body('email')
    .exists().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .exists().withMessage('Password is required')
    .notEmpty().withMessage('Password cannot be empty')
];

// Middleware to handle validation errors
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn(`Validation failed: ${JSON.stringify(errors.array())}`);
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};
