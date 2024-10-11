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

// Google OAuth Authentication
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

// Google OAuth Callback
export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: true,
  })(req, res, (err: Error) => {
    if (err) {
      logger.error(`Google login error: ${err.message}`);
      return next(err);
    }
    res.redirect('/dashboard'); // Redirect to user dashboard after successful login
  });
};

// Instagram OAuth Authentication
export const instagramAuth = passport.authenticate('instagram');

// Instagram OAuth Callback
export const instagramCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('instagram', {
    failureRedirect: '/login',
    session: true,
  })(req, res, (err: Error) => {
    if (err) {
      logger.error(`Instagram login error: ${err.message}`);
      return next(err);
    }
    res.redirect('/dashboard'); // Redirect after successful Instagram login
  });
};

// Logout Handler
export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      logger.error(`Logout error: ${err.message}`);
      return next(err);
    }
    res.redirect('/'); // Redirect to homepage after logout
  });
};

// Optional: Ensure user is authenticated before accessing protected routes
export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login'); // Redirect to login if not authenticated
};
