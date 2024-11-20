import { Response } from 'express';
import logger from '../logger';
import generateToken from '../generateToken';
import findUserByGoogleId from './findUserByGoogleId';
import createGoogleUser from './createGoogleUser';
import { IUser } from '../../models/user';
import validateRedirectUri from './validateRedirectUri';
// Centralized environment variables
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const isDevelopment = process.env.NODE_ENV === 'development';

const googleCallbackHandler = async (googleUser: IUser, redirectUri: string, res: Response) => {
    try {
        // Validate Google User
        if (!googleUser?.googleId) {
            logger.error('Google ID is undefined.');
            return res.redirect(`${FRONTEND_URL}/signin?error=google_id_missing`);
        }

        // Validate redirectUri
        const validatedRedirectUri = validateRedirectUri(redirectUri);
        if (!validatedRedirectUri) {
            logger.error(`Invalid redirect URI: ${redirectUri}`);
            return res.redirect(`${FRONTEND_URL}/signin?error=invalid_redirect_uri`);
        }

        // Fetch or create the user
        let user = await findUserByGoogleId(googleUser.googleId);
        if (!user) {
            logger.info(`Creating a new user for Google ID: ${googleUser.googleId}`);
            user = await createGoogleUser(googleUser);
        }

        if (!user) {
            logger.error('Failed to create or retrieve the user.');
            return res.redirect(`${FRONTEND_URL}/signin?error=user_creation_failed`);
        }

        // Generate JWT
        const token = generateToken(user._id.toString(), user.role, {
            issuer: isDevelopment ? BACKEND_URL : process.env.BACKEND_URL!,
            audience: isDevelopment ? FRONTEND_URL : process.env.FRONTEND_URL!,
        });

        // Construct and redirect with URL parameters
        const redirectUrl = `${validatedRedirectUri}?token=${encodeURIComponent(token)}&id=${encodeURIComponent(user._id.toString())}&email=${encodeURIComponent(user.email)}&displayName=${encodeURIComponent(user.displayName)}`;
        logger.info(`Redirecting user to: ${redirectUrl}`);
        return res.redirect(redirectUrl);

    } catch (error) {
        const errorMessage = `Error in Google callback handler: ${(error as Error).message}`;
        logger.error(errorMessage);
        return res.redirect(`${FRONTEND_URL}/signin?error=server_error`);
    }
};

export default googleCallbackHandler;
