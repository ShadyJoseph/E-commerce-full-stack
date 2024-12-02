const COOKIE_NAME = 'token';

export const getAuthToken = (): string | null => {
  try {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${COOKIE_NAME}=`));
    if (!token) {
      console.warn('[Auth] Token cookie not found.');
      return null;
    }
    const parsedToken = token.split('=')[1];
    console.log('[Auth] Retrieved auth token:', parsedToken);
    return parsedToken;
  } catch (error) {
    console.error('[Auth] Error retrieving token:', error);
    return null;
  }
};


export const setAuthToken = (token: string, expiresIn: number = 86400): void => {
  try {
    const expires = new Date(Date.now() + expiresIn * 1000).toUTCString();
    const secureFlag = window.location.protocol === 'https:' ? 'Secure' : '';
    document.cookie = `${COOKIE_NAME}=${token}; expires=${expires}; path=/; SameSite=Strict; ${secureFlag}`;
    localStorage.setItem('token', token); // Save token in localStorage as well
    console.log('[Auth] Token set successfully:', token);
  } catch (error) {
    console.error('[Auth] Failed to set auth token:', error);
  }
};

export const removeAuthToken = (): void => {
  try {
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict;`;
    localStorage.removeItem('token'); // Remove token from localStorage
    console.log('[Auth] Token removed successfully.');
  } catch (error) {
    console.error('[Auth] Failed to remove auth token:', error);
  }
};

export const redirectToSignIn = (redirectPath = '/signin'): void => {
  localStorage.removeItem('user');
  removeAuthToken();
  window.location.href = redirectPath;
};
