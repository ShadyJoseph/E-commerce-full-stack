import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import logger from '../utils/logger'; // Assuming you have a logger for logging errors

// Extend the Express Request type using declaration merging
declare global {
  namespace Express {
    interface Request {
      logout(options?: import('passport').LogOutOptions, done?: (err: any) => void): void;
      isAuthenticated(): boolean;
    }
  }
}

// Define constants for redirect URLs
const REDIRECT_URL_HOME = '/';
const REDIRECT_URL_DASHBOARD = '/api/dashboard'; // Updated route with '/api'
const REDIRECT_URL_LOGIN = '/api/auth/login';

// Google OAuth Authentication
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

// Google OAuth Callback
export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { failureRedirect: REDIRECT_URL_LOGIN, session: true })(req, res, (err: Error) => {
    if (err) {
      logger.error(`Google login error: ${err.message}`, { stack: err.stack });
      return next(err);
    }
    logger.info(`User ${req.user?.email} logged in via Google`);
    res.redirect(REDIRECT_URL_DASHBOARD);
  });
};

// Instagram OAuth Authentication
export const instagramAuth = passport.authenticate('instagram');

// Instagram OAuth Callback
export const instagramCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('instagram', { failureRedirect: REDIRECT_URL_LOGIN, session: true })(req, res, (err: Error) => {
    if (err) {
      logger.error(`Instagram login error: ${err.message}`, { stack: err.stack });
      return next(err);
    }
    logger.info(`User ${req.user?.displayName} logged in via Instagram`);
    res.redirect(REDIRECT_URL_DASHBOARD);
  });
};

// Logout Handler
export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      logger.error(`Logout error: ${err.message}`, { stack: err.stack });
      return next(err);
    }
    logger.info(`User ${req.user?.email || req.user?.displayName} logged out`);
    res.redirect(REDIRECT_URL_HOME);
  });
};

// Ensure user is authenticated before accessing protected routes
export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  logger.warn(`Unauthorized access attempt to ${req.originalUrl}`);
  res.redirect(REDIRECT_URL_LOGIN); // Redirect to login if not authenticated
};
