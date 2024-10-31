import User from '../models/user';
import { IUser } from '../models/user';
import logger from './logger';

// Verifies user credentials by email and password
const verifyUserCredentials = async (
  email: string,
  password: string
): Promise<IUser | null> => {
  const user = await User.findOne({ email }) as IUser | null;

  if (!user) {
    logger.warn(`User with email ${email} not found.`);
    return null;
  }

  logger.info(`User found for email ${email}. Verifying password.`);
  
  const passwordMatch = await user.comparePassword(password);
  
  if (!passwordMatch) {
    logger.warn(`Invalid password for email ${email}`);
    return null;
  }

  return user;
};

export default verifyUserCredentials