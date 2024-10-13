import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';

// Middleware to check if user is authenticated (with session-based or Google OAuth)
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user) {
    logger.info(`User ${req.user.email || req.user.displayName} is authenticated.`);
    return next();
  }

  logger.warn(`Unauthorized access attempt to ${req.originalUrl}`);
  return res.status(401).json({ message: 'You must be logged in to access this route' });
};

// Middleware to verify JWT token (for user-based authentication)
export const isJWTAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn(`No JWT token provided for access attempt to ${req.originalUrl}`);
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId) as IUser | null;

    if (!user) {
      logger.warn(`Invalid user token for access attempt to ${req.originalUrl}`);
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user; // Attach user to the request object
    logger.info(`User ${user.email || user.displayName} authenticated using JWT.`);
    return next();
  } catch (error) {
    const err = error as jwt.JsonWebTokenError;
    if (err.name === 'TokenExpiredError') {
      logger.warn(`JWT expired for access attempt to ${req.originalUrl}`);
      return res.status(401).json({ message: 'Token has expired' });
    }

    logger.error(`JWT validation error: ${err.message}`, { stack: err.stack });
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUser;

  if (user && user.role === 'admin') {
    logger.info(`Admin access granted to ${user.email || user.displayName}`);
    return next();
  }

  logger.warn(`Admin access denied to user ${user?.email || 'unknown'} at ${req.originalUrl}`);
  return res.status(403).json({ message: 'You do not have permission to access this route' });
};

// Middleware to check if user is authenticated (with either method)
export const requireAuthentication = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return isAuthenticated(req, res, next);
  }
  return isJWTAuthenticated(req, res, next);
};
