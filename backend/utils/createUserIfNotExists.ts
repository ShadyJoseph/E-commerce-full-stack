import User, { IUser, Address, UserRole } from '../models/user';
import logger from '../utils/logger';

const createUserIfNotExists = async (
  email: string,
  password: string,
  displayName: string,
  addresses: Address[] = []
): Promise<IUser | null> => {
  const existingUser = await User.findOne({ email });
  if (existingUser) return null;

  const newUser = new User({
    email,
    password,
    displayName,
    addresses,
    role: UserRole.User,
  });

  try {
    await newUser.save();
    logger.info(`New user created: ${email}`);
    return newUser;
  } catch (error) {
    logger.error(`Error creating user: ${(error as Error).message}`);
    throw error;
  }
};

export default createUserIfNotExists;
