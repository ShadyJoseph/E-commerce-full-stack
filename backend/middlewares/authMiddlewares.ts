import passport from 'passport';
import { Strategy as GoogleStrategy, Profile as GoogleProfile, VerifyCallback } from 'passport-google-oauth20';
import { Strategy as InstagramStrategy, Profile as InstagramProfile } from 'passport-instagram';
import dotenv from 'dotenv';
import User, { IUser } from '../models/user'; // Import IUser interface
import logger from '../utils/logger';

dotenv.config();

passport.serializeUser((user: Express.User, done: (err: any, id?: string) => void) => {
  done(null, (user as any).id);
});

passport.deserializeUser(async (id: string, done: (err: any, user?: Express.User | null) => void) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google OAuth Strategy with passReqToCallback
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      passReqToCallback: true,
    },
    async (
      req: Express.Request,
      accessToken: string,
      refreshToken: string,
      params: any, // Add params here
      profile: GoogleProfile,
      done: VerifyCallback // Keep this as VerifyCallback
    ) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
          return done(null, existingUser); // Ensure existing user is correctly returned
        }

        const newUser: IUser = new User({ // Specify the type for newUser
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails ? profile.emails[0].value : undefined,
        });
        await newUser.save();
        done(null, newUser); // Pass the new user to done
      } catch (error) {
        done(error); // Remove null in this case
      }
    }
  )
);

// Instagram OAuth Strategy
passport.use(
  new InstagramStrategy(
    {
      clientID: process.env.INSTAGRAM_CLIENT_ID!,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
      callbackURL: process.env.INSTAGRAM_CALLBACK_URL!,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: InstagramProfile,
      done: VerifyCallback // Use VerifyCallback here
    ) => {
      try {
        const existingUser = await User.findOne({ instagramId: profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser: IUser = new User({
          instagramId: profile.id,
          displayName: profile.displayName,
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error); // Remove null in this case
      }
    }
  )
);

export default passport;
