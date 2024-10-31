import logger from '../utils/logger';
import User, { IUser } from '../models/user';

const findUserByGoogleId = async (googleId: string): Promise<IUser | null> => {
  const existingUser = await User.findOne({ googleId });
  if (existingUser) {
    logger.info(`Existing Google user found: ${existingUser.email}`);
    return existingUser;
  }
  return null;
};

export default findUserByGoogleId