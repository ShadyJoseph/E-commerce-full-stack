// blacklist.ts (Module for handling JWT blacklist)

// Using a Map to store blacklisted tokens with expiration timestamps
const tokenBlacklist = new Map<string, number>();

// Function to add a token to the blacklist with an expiration time
export const blacklistToken = (token: string, expirationTimeInMs: number) => {
  const expirationTimestamp = Date.now() + expirationTimeInMs;
  tokenBlacklist.set(token, expirationTimestamp);
  console.log(`Token blacklisted: ${token}, expires at ${new Date(expirationTimestamp).toISOString()}`);

  // Clean up expired tokens periodically
  setTimeout(() => {
    tokenBlacklist.delete(token);
    console.log(`Token removed from blacklist: ${token}`);
  }, expirationTimeInMs);
};

// Function to check if a token is blacklisted
export const isTokenBlacklisted = (token: string): boolean => {
  const expirationTimestamp = tokenBlacklist.get(token);
  if (expirationTimestamp) {
    if (Date.now() < expirationTimestamp) {
      return true; // Token is still valid in the blacklist
    } else {
      // Token is expired, remove it from the blacklist
      tokenBlacklist.delete(token);
      console.log(`Expired token removed from blacklist: ${token}`);
    }
  }
  return false; // Token is not blacklisted or has expired
};
