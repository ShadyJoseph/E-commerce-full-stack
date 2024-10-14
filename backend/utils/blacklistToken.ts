const tokenBlacklist = new Map<string, number>();
const CLEANUP_INTERVAL_MS = process.env.BLACKLIST_CLEANUP_INTERVAL_MS || 60000; // Configurable cleanup interval

// Utility to conditionally log in development mode
const logIfDev = (message: string) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(message);
  }
};

// Function to add a token to the blacklist with an expiration time
export const blacklistToken = (token: string, expirationTimeInMs: number) => {
  const expirationTimestamp = Date.now() + expirationTimeInMs;

  if (tokenBlacklist.has(token)) {
    logIfDev(`Token already blacklisted: ${token}`);
    return;
  }

  // Add token to the blacklist with its expiration time
  tokenBlacklist.set(token, expirationTimestamp);
  logIfDev(`Token blacklisted: ${token}, expires at ${new Date(expirationTimestamp).toISOString()}`);

  // Schedule token removal after expiration using `setImmediate` to prevent blocking the event loop
  setTimeout(() => {
    setImmediate(() => {
      tokenBlacklist.delete(token);
      logIfDev(`Token removed from blacklist: ${token}`);
    });
  }, expirationTimeInMs);
};

// Function to check if a token is blacklisted
export const isTokenBlacklisted = (token: string): boolean => {
  const expirationTimestamp = tokenBlacklist.get(token);

  if (expirationTimestamp !== undefined) {
    if (Date.now() < expirationTimestamp) {
      logIfDev(`Token is still blacklisted: ${token}`);
      return true; // Token is still blacklisted
    } else {
      // Token has expired, remove it from the blacklist
      tokenBlacklist.delete(token);
      logIfDev(`Expired token removed from blacklist: ${token}`);
    }
  }

  logIfDev(`Token is not blacklisted: ${token}`);
  return false; // Token is not blacklisted
};

// Optional: Function to clear all expired tokens from the blacklist
export const clearExpiredTokens = () => {
  const now = Date.now();
  for (const [token, expirationTimestamp] of tokenBlacklist.entries()) {
    if (expirationTimestamp < now) {
      tokenBlacklist.delete(token);
      logIfDev(`Expired token cleared from blacklist: ${token}`);
    }
  }
};

// Optional: Periodic cleanup of expired tokens
setInterval(clearExpiredTokens, CLEANUP_INTERVAL_MS as number); // Clean up every configured interval (default: 60 seconds)
