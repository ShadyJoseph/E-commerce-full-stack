import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import logger from '../utils/logger';
import handleServerError from '../utils/handleServerError';
import generateToken from '../utils/generateToken';
import verifyUserCredentials from '../utils/UserCredentials';
import createUserIfNotExists from '../utils/createUserIfNotExists';
import findUserByGoogleId from '../utils/findUserByGoogleId';
import createGoogleUser from '../utils/createGoogleUser';
import { IUser } from '../models/user';
import handleSessionLogout from '../utils/handleSessionLogout';
import handleJwtLogout from '../utils/handleJwtLogout'

export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { failureRedirect: '/signin', session: false })(req, res, async (err: Error) => {
    if (res.headersSent) return;

    if (err || !req.user) {
      logger.error(`Google login error: ${err?.message || 'User not authenticated'}`);
      return res.redirect(`${process.env.FRONTEND_URL}/signin?error=auth_failed`);
    }

    try {
      const googleUser = req.user as IUser;
      if (!googleUser?.googleId) {
        logger.error('Google ID is undefined in the authenticated user.');
        return res.redirect(`${process.env.FRONTEND_URL}/signin?error=google_id_missing`);
      }

      // Find or create the user in the database
      let user = await findUserByGoogleId(googleUser.googleId);
      if (!user) {
        logger.info(`Creating a new user for Google ID: ${googleUser.googleId}`);
        user = await createGoogleUser(googleUser);
      }

      if (!user) {
        logger.error('Failed to create or retrieve the user.');
        return res.redirect(`${process.env.FRONTEND_URL}/signin?error=user_creation_failed`);
      }

      // Generate a secure token
      const token = generateToken(user._id.toString(), user.role);
      logger.info(`User authenticated successfully: ${user.email}`);

      // Retrieve and validate `redirectUri`
      const redirectUri = req.query.state
        ? decodeURIComponent(req.query.state as string)
        : `${process.env.FRONTEND_URL}/google/callback`;

      if (!redirectUri.startsWith(process.env.FRONTEND_URL || '')) {
        logger.warn(`Invalid redirectUri in callback: ${redirectUri}`);
        return res.redirect(`${process.env.FRONTEND_URL}/signin?error=invalid_redirect_uri`);
      }

      // Construct the redirect URL
      const redirectUrl = `${redirectUri}?token=${encodeURIComponent(token)}&id=${encodeURIComponent(user._id.toString())}&email=${encodeURIComponent(user.email)}&displayName=${encodeURIComponent(user.displayName)}`;
      return res.redirect(redirectUrl);
    } catch (error) {
      logger.error(`Error during Google callback: ${(error as Error).message}`);
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

    const token = generateToken(newUser._id.toString(), newUser.role);
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

    const token = generateToken(user._id.toString(), user.role);
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
