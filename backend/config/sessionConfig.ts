import session from 'express-session';
import MongoStore from 'connect-mongo';

const sessionConfig = (mongoUrl: string, sessionSecret: string) => {
  return session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl,
      ttl: 2 * 24 * 60 * 60, // 2 days
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure only in production
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Allow different settings per environment
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
    proxy: process.env.NODE_ENV === 'production', // Enable if behind a proxy in production
  });
};

export default sessionConfig;
