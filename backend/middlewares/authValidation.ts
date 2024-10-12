// middlewares/authValidation.ts

import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger'; // Ensure you have a logger utility set up

// Middleware to check if user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user) {
    logger.info(`User ${req.user.email || req.user.displayName} is authenticated.`);
    return next();
  }

  logger.warn(`Unauthorized access attempt to ${req.originalUrl}`);
  return res.status(401).json({ message: 'You must be logged in to access this route' });
};

// Middleware to check if user is admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    logger.info(`User ${req.user.email || req.user.displayName} is an admin.`);
    return next();
  }

  logger.warn(`Unauthorized access attempt to ${req.originalUrl} by non-admin user ${req.user?.email || 'unknown'}`);
  return res.status(403).json({ message: 'You do not have permission to access this route' });
};
