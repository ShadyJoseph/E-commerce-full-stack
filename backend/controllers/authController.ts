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

// Google OAuth Authentication
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

// Google OAuth Callback
export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  // Ensure this route is not accessed directly
  if (!req.user) {
    return res.redirect('/api/auth/google');
  }

  passport.authenticate('google', { failureRedirect: REDIRECT_URL_LOGIN, session: true })(req, res, (err: Error) => {
    if (err) {
      logger.error(`Google login error: ${err.message}`, { stack: err.stack });
      return next(err);
    }
    logger.info(`User ${req.user?.email} logged in via Google`);
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
