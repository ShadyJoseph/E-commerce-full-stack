import jwt from 'jsonwebtoken';
import logger from './logger';
import { blacklistToken } from './blacklistToken';

// Decode JWT Helper
 const decodeToken = (token: string): jwt.JwtPayload | null => {
    try {
        return jwt.decode(token) as jwt.JwtPayload | null;
    } catch (error) {
        logger.error(`Error decoding JWT token: ${(error as Error).message}`);
        return null;
    }
};

export const blacklistJwtToken = (token: string) => {
    const decodedToken = decodeToken(token);
    if (decodedToken && decodedToken.exp) {
        const timeToExpire = (decodedToken.exp - Math.floor(Date.now() / 1000)) * 1000;
        blacklistToken(token, timeToExpire);
    } else {
        logger.warn('Could not decode JWT expiration time.');
    }
};