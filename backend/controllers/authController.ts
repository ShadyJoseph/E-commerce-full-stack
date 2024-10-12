// controllers/authController.ts

import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import logger from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      logout(options?: import('passport').LogOutOptions, done?: (err: any) => void): void;
      isAuthenticated(): boolean;
    }
  }
}

const REDIRECT_URL_HOME = '/';
const REDIRECT_URL_DASHBOARD = '/api/dashboard';
const REDIRECT_URL_LOGIN = '/api/auth/login';

// Google OAuth Authentication - Starts the Google OAuth process
export const googleAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    logger.info(`User already authenticated, redirecting to dashboard.`);
    return res.redirect(REDIRECT_URL_DASHBOARD);
  }

  logger.info('Redirecting to Google for authentication');
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    accessType: 'offline',
    prompt: 'consent',
  })(req, res, next);
};

// Google OAuth Callback - Handles the response from Google after authentication
export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { failureRedirect: REDIRECT_URL_LOGIN, session: true })(req, res, (err: Error | null) => {
    if (err) {
      logger.error(`Google login error: ${err.message}`, { stack: err.stack });
      return next(err);
    }

    if (!req.user) {
      logger.error('Google callback: user not authenticated');
      return res.redirect(REDIRECT_URL_LOGIN);
    }

    logger.info(`User ${req.user?.email || req.user?.displayName} logged in via Google`);
    res.redirect(REDIRECT_URL_DASHBOARD);
  });
};

// Logout Handler
export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err: Error | null) => {
    if (err) {
      logger.error(`Logout error: ${err.message}`, { stack: err.stack });
      return next(err);
    }

    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        logger.error(`Session destroy error: ${destroyErr.message}`, { stack: destroyErr.stack });
        return next(destroyErr);
      }

      logger.info(`User ${req.user?.email || req.user?.displayName} logged out`);
      res.clearCookie('connect.sid'); // Clear session cookie
      res.redirect(REDIRECT_URL_HOME);
    });
  });
};
