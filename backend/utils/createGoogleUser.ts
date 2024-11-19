import logger from '../utils/logger';
import User, { IUser, UserRole } from '../models/user';

const createGoogleUser = async (googleUser: Partial<IUser>): Promise<IUser> => {
  if (!googleUser.email || !googleUser.googleId) {
    throw new Error('Missing required fields: email or Google ID');
  }

  const newUser = new User({
    email: googleUser.email,
    displayName: googleUser.displayName,
    googleId: googleUser.googleId,
    role: googleUser.role || UserRole.User, // Default to 'User' role
  });

  try {
    await newUser.save();
    logger.info(`New Google user created successfully: ${googleUser.email}`);
    return newUser;
  } catch (error) {
    logger.error(`Error creating Google user: ${(error as Error).message}`);
    throw error;
  }
};

export default createGoogleUser;
