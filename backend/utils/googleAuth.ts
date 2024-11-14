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
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

export default googleAuth;


