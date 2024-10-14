// Using a Map to store blacklisted tokens with expiration timestamps
const tokenBlacklist = new Map<string, number>();

// Function to add a token to the blacklist with an expiration time
export const blacklistToken = (token: string, expirationTimeInMs: number) => {
  const expirationTimestamp = Date.now() + expirationTimeInMs;

  // Check if the token is already blacklisted
  if (tokenBlacklist.has(token)) {
    console.log(`Token already blacklisted: ${token}`);
    return; // Optional: Prevent re-adding the same token
  }

  tokenBlacklist.set(token, expirationTimestamp);
  console.log(`Token blacklisted: ${token}, expires at ${new Date(expirationTimestamp).toISOString()}`);

  // Schedule token removal from the blacklist after expiration
  setTimeout(() => {
    tokenBlacklist.delete(token);
    console.log(`Token removed from blacklist: ${token}`);
  }, expirationTimeInMs);
};

// Function to check if a token is blacklisted
export const isTokenBlacklisted = (token: string): boolean => {
  const expirationTimestamp = tokenBlacklist.get(token);

  if (expirationTimestamp !== undefined) {
    if (Date.now() < expirationTimestamp) {
      console.log(`Token is still blacklisted: ${token}`);
      return true; // Token is still valid in the blacklist
    } else {
      // Token is expired, remove it from the blacklist
      tokenBlacklist.delete(token);
      console.log(`Expired token removed from blacklist: ${token}`);
    }
  }

  console.log(`Token is not blacklisted: ${token}`);
  return false; // Token is not blacklisted or has expired
};

// Optional: Function to clear all expired tokens from the blacklist
export const clearExpiredTokens = () => {
  const now = Date.now();
  for (const [token, expirationTimestamp] of tokenBlacklist.entries()) {
    if (expirationTimestamp < now) {
      tokenBlacklist.delete(token);
      console.log(`Expired token cleared from blacklist: ${token}`);
    }
  }
};

// Optional: Periodic cleanup of expired tokens
setInterval(clearExpiredTokens, 60000); // Clean up every 60 seconds
