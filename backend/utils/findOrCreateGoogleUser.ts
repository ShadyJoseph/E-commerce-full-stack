import logger from '../utils/logger';
import User, { IUser } from '../models/user';
import passport from 'passport';
import { Request, Response, NextFunction } from 'express';

export const findOrCreateGoogleUser = async (googleUser: IUser): Promise<void> => {
    const existingUser = await User.findOne({ googleId: googleUser.googleId });
  
    if (existingUser) {
      logger.info(`Existing Google user ${googleUser.email} found`);
      return;
    }
  
    const newUser = new User({
      email: googleUser.email,
      displayName: googleUser.displayName,
      googleId: googleUser.googleId,
      role: 'user',
    }) as IUser;
  
    await newUser.save();
    logger.info(`New Google user ${googleUser.email} registered successfully.`);
  };

  
  export const googleAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      logger.info(`User already authenticated, redirecting to dashboard.`);
      return res.redirect('/api/dashboard');
    }
  
    logger.info('Redirecting to Google for authentication');
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  };