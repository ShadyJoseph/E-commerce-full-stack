import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import logger from './logger';

const googleAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    logger.info('User already authenticated.');
    return res.status(200).json({ success: true, message: 'User already authenticated' });
  }

  logger.info('Redirecting to Google for authentication.');

  // Validate `redirectUri`
  const redirectUri = req.query.redirect_uri ? decodeURIComponent(req.query.redirect_uri as string) : process.env.FRONTEND_URL || '';
  if (!redirectUri.startsWith(process.env.FRONTEND_URL || '')) {
    logger.warn(`Invalid redirectUri: ${redirectUri}`);
    return res.status(400).json({ error: 'Invalid redirect_uri' });
  }

  // Pass `redirectUri` as `state`
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: encodeURIComponent(redirectUri),
  })(req, res, next);
};

export default googleAuth;
