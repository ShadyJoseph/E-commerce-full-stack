import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import logger from '../utils/logger';
import { handleServerError } from '../utils/handleServerError';
import { generateToken } from '../utils/generateToken';
import { verifyUserCredentials } from '../utils/UserCredentials';
import { createUserIfNotExists } from '../utils/createUserIfNotExists';
import { findUserByGoogleId } from '../utils/findUserByGoogleId';
import { createGoogleUser } from '../utils/createGoogleUser';
import { IUser } from '../models/user';
import { handleSessionLogout } from '../utils/handleSessionLogout';
import { handleJwtLogout } from '../utils/handleJwtLogout'

export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { failureRedirect: '/api/auth/login', session: true })(
    req,
    res,
    async (err: Error) => {
      if (err || !req.user) {
        logger.error(`Google login error: ${err?.message || 'User not authenticated'}`);
        return res.redirect('/api/auth/login');
      }

      try {
        const googleId = (req.user as IUser).googleId;
        if (!googleId) {
          logger.error('Google ID is undefined');
          return res.redirect('/api/auth/login');
        }

        const existingUser = await findUserByGoogleId(googleId);
        const user = existingUser || (await createGoogleUser(req.user as IUser));
        if (!user) throw new Error('Failed to create or find the user');

        req.login(user, (loginErr) => {
          if (loginErr) {
            return next(loginErr);
          }

          res.cookie('token', generateToken(user._id.toString(), user.role), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
          });
          logger.info(`Google user authenticated: ${user.email}`);
          res.redirect('/api/dashboard');
        });
      } catch (error) {
        handleServerError(res, error as Error, 'Error during Google callback');
      }
    }
  );
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
    if (token) {
      handleJwtLogout(req, res); // Handle JWT logout by blacklisting the token
    }

    if (req.isAuthenticated() && user?.googleId) {
      handleSessionLogout(req, res); // Handle session logout specifically for Google-authenticated users
    } else if (!token) {
      return res.status(400).json({ message: 'No active session or token found for logout.' });
    }
  } catch (error: any) {
    logger.error(`Logout error for user ${user?.email || user?.displayName}: ${error.message}`);
    return res.status(500).json({ message: 'Unexpected logout error' });
  }
};

