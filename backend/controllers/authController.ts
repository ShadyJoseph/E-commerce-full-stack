// Import necessary modules
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import logger from '../utils/logger';

// Extend Express's Request interface to include logout and isAuthenticated methods
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
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'], // Define scope for requesting user data from Google
});

// Google OAuth Callback - Handles the response from Google after authentication
export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { failureRedirect: REDIRECT_URL_LOGIN, session: true })(req, res, (err: Error | null) => { 
    if (err) {
      logger.error(`Google login error: ${err.message}`, { stack: err.stack });
      return next(err);
    }

    // Ensure that a user is authenticated, otherwise redirect to login
    if (!req.user) {
      logger.error('Google callback: user not authenticated');
      return res.redirect(REDIRECT_URL_LOGIN);
    }

    // Successful login: log user and redirect to dashboard
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

    // Destroy the session after logout
    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        logger.error(`Session destroy error: ${destroyErr.message}`, { stack: destroyErr.stack });
        return next(destroyErr);
      }

      // Log the logout action and redirect to home
      logger.info(`User ${req.user?.email || req.user?.displayName} logged out`);
      res.clearCookie('connect.sid'); // Clear the session cookie (replace 'connect.sid' with the actual session cookie name if different)
      res.redirect(REDIRECT_URL_HOME);
    });
  });
};

