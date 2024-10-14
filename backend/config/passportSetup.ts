import passport from 'passport';
import { Strategy as GoogleStrategy, StrategyOptions } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User, { IUser } from '../models/user';
import logger from '../utils/logger';

dotenv.config();

// Serialize user ID into session
passport.serializeUser((user: Express.User, done: (err: any, id?: string) => void) => {
  done(null, (user as IUser).id);
});

// Deserialize user from session using ID
passport.deserializeUser(async (id: string, done: (err: any, user?: Express.User | null) => void) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      logger.warn(`User not found during deserialization: ${id}`);
      return done(null, null); // User not found
    }
    done(null, user);
  } catch (err) {
    logger.error(`Error during deserialization: ${err}`);
    done(err, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      accessType: 'offline', // To get refresh token
      prompt: 'consent', // Forces consent screen every time
    } as StrategyOptions,
    async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: IUser | false) => void) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id }) as IUser;

        if (existingUser) {
          // Update refresh token if available
          if (refreshToken && existingUser.refreshToken !== refreshToken) {
            existingUser.refreshToken = refreshToken; // Assign refreshToken to existing user
            await existingUser.save();
            logger.info(`Updated refresh token for user: ${existingUser.displayName}`);
          }
          return done(null, existingUser);
        }

        const newUser: IUser = new User({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails ? profile.emails[0].value : undefined,
          refreshToken, // Save refresh token for new user
        });
        
        await newUser.save();
        logger.info(`Created new user from Google OAuth: ${newUser.displayName}`);
        done(null, newUser);
      } catch (error) {
        logger.error('Error in Google Strategy:', error);
        done(error);
      }
    }
  )
);

export default passport;
