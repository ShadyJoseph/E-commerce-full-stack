import logger from './logger';
import passport from 'passport';
import { Request, Response, NextFunction } from 'express';


export const googleAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    logger.info(`User already authenticated, redirecting to dashboard.`);
    return res.redirect('/api/dashboard');
  }

  logger.info('Redirecting to Google for authentication');
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};
