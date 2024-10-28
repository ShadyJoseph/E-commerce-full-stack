import { Request, Response } from 'express';
import { blacklistJwtToken } from '../utils/logoutHelpers';

// JWT Logout Handler
export const handleJwtLogout = (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token required for logout' });
  
    blacklistJwtToken(token);
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out successfully' });
  };

