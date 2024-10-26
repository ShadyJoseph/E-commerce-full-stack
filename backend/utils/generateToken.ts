import jwt from 'jsonwebtoken';

// JWT Token Utility
export const generateToken = (userId: string, role: string) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  };
  