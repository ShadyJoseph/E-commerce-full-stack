import logger from '../logger';
import User, { IUser } from '../../models/user';

const findUserByGoogleId = async (googleId: string): Promise<IUser | null> => {
  try {
    const existingUser = await User.findOne({ googleId });
    if (existingUser) {
      logger.info(`Existing Google user found: ${existingUser.email}`);
      return existingUser;
    }
    logger.info(`No user found for Google ID: ${googleId}`);
    return null;
  } catch (error) {
    logger.error(`Error finding user by Google ID (${googleId}): ${(error as Error).message}`);
    throw error;
  }
};

export default findUserByGoogleId;
