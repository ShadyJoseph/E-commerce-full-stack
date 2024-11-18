import logger from './logger';
import passport from 'passport';
import { Request, Response, NextFunction } from 'express';

const googleAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    logger.info('User already authenticated.');
    return res.status(200).json({
      success: true,
      message: 'User already authenticated',
    });
  }

  logger.info('Redirecting to Google for authentication');
  
  // Ensure redirectUri is always a string
  const redirectUri = (req.query.redirect_uri as string) || process.env.FRONTEND_URL || '';

  // Pass redirectUri as state after encoding
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: encodeURIComponent(redirectUri), // State to pass redirect URI
  })(req, res, next);
};

export default googleAuth;
