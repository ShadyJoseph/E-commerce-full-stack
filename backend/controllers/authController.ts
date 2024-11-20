import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import logger from '../utils/logger';
import handleServerError from '../utils/handleServerError';
import generateToken from '../utils/generateToken';
import verifyUserCredentials from '../utils/UserCredentials';
import createUserIfNotExists from '../utils/createUserIfNotExists';
import { IUser } from '../models/user';
import handleSessionLogout from '../utils/googleUtils/handleSessionLogout';
import handleJwtLogout from '../utils/handleJwtLogout'
import validateRedirectUri from '../utils/googleUtils/validateRedirectUri';
import googleCallbackHandler from '../utils/googleUtils/googleCallbackHandler';


const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const isDevelopment = process.env.NODE_ENV === 'development';


export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { failureRedirect: '/signin', session: false })(req, res, async (err: Error) => {
    if (res.headersSent) return;

    if (err || !req.user) {
      logger.error(`Google login error: ${err?.message || 'User not authenticated'}`);
      return res.redirect(`${process.env.FRONTEND_URL}/signin?error=auth_failed`);
    }

    try {
      const googleUser = req.user as IUser;

      // Validate Google user and redirect URI
      const redirectUri = validateRedirectUri(req.query.state as string) || `${process.env.FRONTEND_URL}/google/callback`;

      if (!redirectUri) {
        logger.warn(`Invalid redirectUri in callback: ${req.query.state}`);
        return res.redirect(`${process.env.FRONTEND_URL}/signin?error=invalid_redirect_uri`);
      }

      // Handle Google callback logic
      await googleCallbackHandler(googleUser, redirectUri, res);
    } catch (error) {
      logger.error(`Unexpected error during Google callback: ${(error as Error).message}`);
      if (!res.headersSent) {
        return res.redirect(`${process.env.FRONTEND_URL}/signin?error=server_error`);
      }
    }
  });
};

// User Signup
export const userSignUp = async (req: Request, res: Response) => {
  const { email, password, displayName, addresses } = req.body;
  logger.info(`Sign-up attempt for email: ${email}`);

  try {
    const newUser = await createUserIfNotExists(email, password, displayName, addresses);
    if (!newUser) {
      logger.warn(`Sign-up failed: User ${email} already exists`);
      return res.status(400).json({ message: 'User already exists' });
    }

    const token = generateToken(newUser._id.toString(), newUser.role, {
      issuer: isDevelopment ? BACKEND_URL : process.env.BACKEND_URL!,
      audience: isDevelopment ? FRONTEND_URL : process.env.FRONTEND_URL!,
    });

    res.status(201).cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    }).json({
      message: 'Sign up successful',
      token,
      user: { email: newUser.email, displayName: newUser.displayName }
    });
  } catch (error) {
    handleServerError(res, error as Error, `Sign-up error for email ${email}`);
  }
};

// User Login
export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  logger.info(`Login attempt for email: ${email}`);

  try {
    const user = await verifyUserCredentials(email, password);
    if (!user) {
      logger.warn(`Login attempt: Invalid credentials for ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id.toString(), user.role, {
      issuer: isDevelopment ? BACKEND_URL : process.env.BACKEND_URL!,
      audience: isDevelopment ? FRONTEND_URL : process.env.FRONTEND_URL!,
    });
    res.status(200).cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    }).json({
      message: 'Login successful',
      token,
      user: { email: user.email, displayName: user.displayName, role: user.role }
    });
  } catch (error) {
    handleServerError(res, error as Error, `Login error for email ${email}`);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as { email?: string; displayName?: string; googleId?: string };
  const token = req.headers.authorization?.split(' ')[1];

  try {
    // Handle JWT Logout
    if (token) {
      handleJwtLogout(req, res); // Send response for JWT logout
      return; // Exit after handling JWT logout to avoid multiple responses
    }

    // Handle Session Logout
    if (req.isAuthenticated() && user?.googleId) {
      handleSessionLogout(req, res); // Send response for session logout
      return; // Exit after handling session logout
    }

    // If no session or token is found
    res.status(400).json({ message: 'No active session or token found for logout.' });
  } catch (error: any) {
    logger.error(`Logout error for user ${user?.email || user?.displayName}: ${error.message}`);
    res.status(500).json({ message: 'Unexpected logout error' });
  }
};
