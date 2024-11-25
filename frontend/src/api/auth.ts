const COOKIE_NAME = 'token';

export const getAuthToken = (): string | null => {
  try {
    const token = document.cookie.split('; ').find(row => row.startsWith(`${COOKIE_NAME}=`));
    return token ? token.split('=')[1] : null;
  } catch (error) {
    console.error('Failed to retrieve auth token:', error);
    return null;
  }
};

export const setAuthToken = (token: string, expiresIn: number = 86400): void => {
  try {
    const expires = new Date(Date.now() + expiresIn * 1000).toUTCString();
    const secureFlag = window.location.protocol === 'https:' ? 'Secure' : '';
    document.cookie = `${COOKIE_NAME}=${token}; expires=${expires}; path=/; SameSite=Strict; ${secureFlag}`;
  } catch (error) {
    console.error('Failed to set auth token:', error);
  }
};

export const removeAuthToken = (): void => {
  try {
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict; Secure`;
  } catch (error) {
    console.error('Failed to remove auth token:', error);
  }
};

export const redirectToSignIn = (redirectPath = '/'): void => {
  localStorage.removeItem('user');
  removeAuthToken();
  window.location.href = redirectPath;
};
