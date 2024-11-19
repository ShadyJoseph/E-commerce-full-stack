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

// Google Profile Interface
interface GoogleProfile {
  id: string;
  displayName: string;
  emails?: { value: string }[];
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      accessType: 'offline', // To get a refresh token
      prompt: 'consent', // Forces the consent screen
    } as StrategyOptions,
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          logger.error(`Google profile missing email: ${profile.id}`);
          return done(new Error('Google profile does not have an email'), false);
        }

        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          // Update the refresh token if it has changed
          if (refreshToken && user.refreshToken !== refreshToken) {
            user.refreshToken = refreshToken;
            await user.save();
            logger.info(`Updated refresh token for user: ${user.email}`);
          }
          return done(null, user);
        }

        // Create a new user if not found
        user = new User({
          googleId: profile.id,
          displayName: profile.displayName,
          email,
          refreshToken,
        });
        await user.save();
        logger.info(`New user created via Google OAuth: ${user.email}`);
        done(null, user);
      } catch (error) {
        logger.error('Error during Google OAuth Strategy:', error);
        done(error);
      }
    }
  )
);

export default passport;
