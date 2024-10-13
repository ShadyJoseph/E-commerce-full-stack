import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user'; // Import IUser here
import logger from '../utils/logger';

// Define redirect URLs
const REDIRECT_URL_HOME = '/';
const REDIRECT_URL_DASHBOARD = '/api/dashboard';
const REDIRECT_URL_LOGIN = '/api/auth/login';

// Utility for error handling
const handleServerError = (res: Response, error: Error, message: string) => {
  logger.error(`${message}: ${error.message}`, { stack: error.stack });
  res.status(500).json({ message: 'Internal server error' });
};

// JWT Token Utility
const generateToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET!, { expiresIn: '1d' });
};

// Google OAuth Authentication
export const googleAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    logger.info(`User already authenticated, redirecting to dashboard.`);
    return res.redirect(REDIRECT_URL_DASHBOARD);
  }

  logger.info('Redirecting to Google for authentication');
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })(req, res, next);
};

// Google OAuth Callback
export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { failureRedirect: REDIRECT_URL_LOGIN, session: true })(req, res, (err: Error | null) => {
    if (err) {
      return handleServerError(res, err, 'Google login error');
    }

    if (!req.user) {
      logger.error('Google callback: user not authenticated');
      return res.redirect(REDIRECT_URL_LOGIN);
    }

    logger.info(`User ${req.user?.email || req.user?.displayName} logged in via Google`);
    res.redirect(REDIRECT_URL_DASHBOARD);
  });
};

export const userSignUp = async (req: Request, res: Response) => {
  const { email, password, displayName } = req.body;

  try {
    const existingUser = await User.findOne({ email }) as IUser | null; // Explicitly cast to IUser
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
      email,
      password,
      displayName,
    }) as IUser; // Assert the type to IUser

    await newUser.save();
    logger.info(`User ${email} signed up successfully`);

    const token = generateToken(newUser._id.toString(), newUser.role); // Use newUser._id here

    res
      .status(201)
      .json({ message: 'Sign up successful', token, user: { email: newUser.email, displayName: newUser.displayName } });
  } catch (error) {
    handleServerError(res, error as Error, 'Sign-up error');
  }
};

// Inside userLogin
export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }) as IUser | null; // Cast here as IUser | null
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id.toString(), user.role); // Use user._id here
    logger.info(`User ${email} logged in successfully`);

    res
      .status(200)
      .cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
      .json({ message: 'Login successful', token, user: { email: user.email, displayName: user.displayName, role: user.role } });
  } catch (error) {
    handleServerError(res, error as Error, 'Login error');
  }
};

// Logout Handler
export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err: Error | null) => {
    if (err) {
      return handleServerError(res, err, 'Logout error');
    }

    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        return handleServerError(res, destroyErr, 'Session destroy error');
      }

      logger.info(`User ${req.user?.email || req.user?.displayName} logged out`);
      res.clearCookie('connect.sid'); // Clear session cookie
      res.redirect(REDIRECT_URL_HOME);
    });
  });
};
