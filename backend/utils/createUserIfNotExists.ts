import logger from '../utils/logger';
import User, { IUser } from '../models/user';
import bcrypt from 'bcryptjs';

export const createUserIfNotExists = async (
    email: string,
    password: string,
    displayName: string,
    addresses: any[] = []
): Promise<IUser | null> => {
    const existingUser = await User.findOne({ email }) as IUser | null;
    if (existingUser) return null;

    const hashedPassword = await hashPassword(password);
    const newUser = new User({
        email,
        password: hashedPassword,
        displayName,
        addresses,
        role: 'user'
    }) as IUser;

    await newUser.save();
    logger.info(`New user ${email} created successfully`);
    return newUser;
};

const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};
