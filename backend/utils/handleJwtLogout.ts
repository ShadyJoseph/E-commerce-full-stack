import { Request, Response } from 'express';
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

const blacklistJwtToken = (token: string) => {
    const decodedToken = decodeToken(token);
    if (decodedToken && decodedToken.exp) {
        const timeToExpire = (decodedToken.exp - Math.floor(Date.now() / 1000)) * 1000;
        blacklistToken(token, timeToExpire);
    } else {
        logger.warn('Could not decode JWT expiration time.');
    }
};

// JWT Logout Handler
const handleJwtLogout = (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token required for logout' });
  
    blacklistJwtToken(token);
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out successfully' });
  };

export default handleJwtLogout