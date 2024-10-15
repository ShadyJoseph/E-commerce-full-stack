import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';
import logger from '../utils/logger';
import { blacklistToken } from '../utils/blacklistToken';

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
    logger.info(`User already authenticated (session-based), redirecting to dashboard.`);
    return res.redirect('/api/dashboard');
  }

  logger.info('Redirecting to Google for authentication');
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })(req, res, next);
};

// Google OAuth Callback
export const googleCallback = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { failureRedirect: '/api/auth/login', session: true })(req, res, async (err: Error | null) => {
    if (err) {
      return handleServerError(res, err, 'Google login error');
    }

    if (!req.user) {
      logger.error('Google callback: user not authenticated');
      return res.redirect('/api/auth/login');
    }

    const googleUser = req.user as IUser;
    try {
      const existingUser = await User.findOne({ googleId: googleUser.googleId });
      if (!existingUser) {
        // First-time Google login, creating new user
        const newUser = new User({
          email: googleUser.email,
          displayName: googleUser.displayName,
          googleId: googleUser.googleId,
          role: 'user', // Default role
        }) as IUser;
        await newUser.save();
        logger.info(`New Google user ${googleUser.email} registered successfully.`);
      }

      logger.info(`Google user ${googleUser.email} logged in via Google`);
      res.redirect('/api/dashboard');
    } catch (error) {
      handleServerError(res, error as Error, 'Error during Google callback');
    }
  });
};

// User Sign-up (JWT)
export const userSignUp = async (req: Request, res: Response) => {
  const { email, password, displayName, addresses } = req.body;
  logger.info(`Sign-up attempt for email: ${email}`);

  try {
    const existingUser = await User.findOne({ email }) as IUser | null;

    if (existingUser) {
      logger.warn(`Sign-up attempt: User ${email} already exists`);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      password: hashedPassword,
      displayName,
      addresses: addresses || [],
      role: 'user', // Default role
    }) as IUser;

    await newUser.save();
    logger.info(`User ${email} signed up successfully`);

    const token = generateToken(newUser._id.toString(), newUser.role);
    logger.info(`Token generated for new user ${email}`);

    res
      .status(201)
      .cookie('token', token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict', 
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      })
      .json({ message: 'Sign up successful', token, user: { email: newUser.email, displayName: newUser.displayName } });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Sign-up error for email ${email}: ${error.message}`, { stack: error.stack });
      handleServerError(res, error, 'Sign-up error');
    } else {
      logger.error(`Sign-up error for email ${email}: Unexpected error`, { error });
      handleServerError(res, new Error('Unexpected error'), 'Sign-up error');
    }
  }
};

// User Login
export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  logger.info(`Login attempt for email: ${email}`);

  try {
    const user = await User.findOne({ email }) as IUser | null;

    if (!user) {
      logger.warn(`Login attempt: User not found for ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    logger.info(`User found: ${user.email}. Proceeding to password comparison.`);
    const passwordMatch = await user.comparePassword(password);

    if (!passwordMatch) {
      logger.warn(`Login attempt: Invalid credentials for ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    logger.info(`Password match for user: ${email}. Generating JWT token.`);
    const token = generateToken(user._id.toString(), user.role);

    logger.info(`User ${email} logged in successfully, token generated.`);

    res
      .status(200)
      .cookie('token', token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict', 
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      })
      .json({ message: 'Login successful', token, user: { email: user.email, displayName: user.displayName, role: user.role } });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Login error for email ${email}: ${error.message}`, { stack: error.stack });
      handleServerError(res, error, 'Login error');
    } else {
      logger.error(`Login error for email ${email}: Unexpected error`, { error });
      handleServerError(res, new Error('Unexpected error'), 'Login error');
    }
  }
};

// User Logout
export const logout = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as { email?: string; displayName?: string };

  // JWT-based logout (Google or token-based authentication)
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    logger.info(`JWT-based logout for user: ${user?.email || user?.displayName}`);

    try {
      // Decode token to get its expiration time
      const decodedToken = jwt.decode(token) as jwt.JwtPayload | null;

      if (decodedToken && decodedToken.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        const timeToExpire = (decodedToken.exp - currentTime) * 1000; // convert to milliseconds

        // Blacklist the token for its remaining lifetime
        blacklistToken(token, timeToExpire);
      } else {
        logger.warn('Could not decode JWT expiration time.');
      }
    } catch (error:any) {
      logger.error(`Error decoding JWT token: ${error.message}`);
    }

    // Clear the JWT token cookie
    res.clearCookie('token'); // Assumes token is stored in a cookie
    return res.status(200).json({ message: 'Logged out successfully' });
  }

  // Session-based logout
  if (req.isAuthenticated()) {
    req.logout((err: Error | null) => {
      if (err) {
        logger.error(`Logout error: ${err.message}`);
        return res.status(500).json({ message: 'Logout error' });
      }

      // Destroy session only if it exists
      if (req.session) {
        req.session.destroy((destroyErr) => {
          if (destroyErr) {
            logger.error(`Session destroy error: ${destroyErr.message}`);
            return res.status(500).json({ message: 'Error clearing session' });
          }

          logger.info(`User ${user?.email || user?.displayName} logged out successfully`);
          res.clearCookie('connect.sid'); // Clear session cookie
          return res.status(200).json({ message: 'Logged out successfully' });
        });
      } else {
        logger.warn('No active session found.');
        return res.status(200).json({ message: 'Logged out successfully' });
      }
    });
  } else {
    logger.warn('Unauthorized logout attempt.');
    return res.status(401).json({ message: 'You must be logged in to log out' });
  }
};
