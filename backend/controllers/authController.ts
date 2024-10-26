import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import { blacklistToken } from '../utils/blacklistToken';
import { handleServerError } from '../utils/handleServerError';
import { generateToken } from '../utils/generateToken';
import { verifyUserCredentials } from '../utils/UserCredentials';
import { findOrCreateGoogleUser } from '../utils/findOrCreateGoogleUser';
import { createUserIfNotExists } from '../utils/createUserIfNotExists';
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

    try {
      const googleUser = req.user;
      await findOrCreateGoogleUser(googleUser);
      logger.info(`Google user ${googleUser.email} authenticated and redirected to dashboard`);
      res.redirect('/api/dashboard');
    } catch (error) {
      handleServerError(res, error as Error, 'Error during Google callback');
    }
  });
};

export const userSignUp = async (req: Request, res: Response) => {
  const { email, password, displayName, addresses } = req.body;
  logger.info(`Sign-up attempt for email: ${email}`);

  try {
    // Check and create user
    const newUser = await createUserIfNotExists(email, password, displayName, addresses);

    if (!newUser) {
      logger.warn(`Sign-up attempt: User ${email} already exists`);
      return res.status(400).json({ message: 'User already exists' });
    }

    logger.info(`User ${email} signed up successfully`);

    // Generate token
    const token = generateToken(newUser._id.toString(), newUser.role);
    logger.info(`Token generated for new user ${email}`);

    // Set token in cookie and respond
    res
      .status(201)
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      })
      .json({
        message: 'Sign up successful',
        token,
        user: { email: newUser.email, displayName: newUser.displayName }
      });
  } catch (error) {
    handleServerError(res, error as Error, `Sign-up error for email ${email}`);
  }
};

export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  logger.info(`Login attempt for email: ${email}`);

  try {
    const user = await verifyUserCredentials(email, password);

    if (!user) {
      logger.warn(`Login attempt: Invalid credentials for ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    logger.info(`Password verified for user ${email}. Generating JWT token.`);
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
      .json({
        message: 'Login successful',
        token,
        user: { email: user.email, displayName: user.displayName, role: user.role }
      });
  } catch (error) {
    handleServerError(res, error as Error, `Login error for email ${email}`);
  }
};

// Helper function to decode the JWT token
const decodeToken = (token: string): jwt.JwtPayload | null => {
  try {
    return jwt.decode(token) as jwt.JwtPayload | null;
  } catch (error) {
    logger.error(`Error decoding JWT token: ${(error as Error).message}`);
    return null;
  }
};

// Helper function to blacklist the JWT token
const blacklistJwtToken = (token: string) => {
  const decodedToken = decodeToken(token);
  if (decodedToken && decodedToken.exp) {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeToExpire = (decodedToken.exp - currentTime) * 1000; // convert to milliseconds
    blacklistToken(token, timeToExpire);
  } else {
    logger.warn('Could not decode JWT expiration time.');
  }
};

// Helper function to handle JWT-based logout
const handleJwtLogout = (req: Request, res: Response, userEmail?: string, userDisplayName?: string) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    logger.warn('JWT logout attempted without a token.');
    return res.status(401).json({ message: 'Token required for logout' });
  }

  logger.info(`JWT-based logout for user: ${userEmail || userDisplayName}`);
  blacklistJwtToken(token);
  res.clearCookie('token'); // Assumes token is stored in a cookie
  return res.status(200).json({ message: 'Logged out successfully' });
};

// Helper function to handle session-based logout
const handleSessionLogout = (req: Request, res: Response, userEmail?: string, userDisplayName?: string) => {
  if (!req.isAuthenticated()) {
    logger.warn('Unauthorized logout attempt.');
    return res.status(401).json({ message: 'You must be logged in to log out' });
  }

  req.logout((err) => {
    if (err) {
      logger.error(`Logout error: ${err.message}`);
      return res.status(500).json({ message: 'Logout error' });
    }

    if (req.session) {
      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          logger.error(`Session destroy error: ${destroyErr.message}`);
          return res.status(500).json({ message: 'Error clearing session' });
        }

        logger.info(`User ${userEmail || userDisplayName} logged out successfully`);
        res.clearCookie('connect.sid'); // Clear session cookie
        return res.status(200).json({ message: 'Logged out successfully' });
      });
    } else {
      logger.warn('No active session found.');
      return res.status(200).json({ message: 'Logged out successfully' });
    }
  });
};

// Main logout controller
export const logout = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as { email?: string; displayName?: string };
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    return handleJwtLogout(req, res, user?.email, user?.displayName);
  } else {
    return handleSessionLogout(req, res, user?.email, user?.displayName);
  }
};