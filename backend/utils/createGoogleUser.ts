import logger from '../utils/logger';
import User, { IUser, UserRole } from '../models/user';

const createGoogleUser = async (googleUser: Partial<IUser>): Promise<IUser> => {
  const newUser = new User({
    email: googleUser.email,
    displayName: googleUser.displayName,
    googleId: googleUser.googleId,
    role: UserRole.User,
  });

  try {
    await newUser.save();
    logger.info(`New Google user created: ${googleUser.email}`);
    return newUser;
  } catch (error) {
    logger.error(`Error creating Google user: ${(error as Error).message}`);
    throw error;
  }
};





export default createGoogleUser