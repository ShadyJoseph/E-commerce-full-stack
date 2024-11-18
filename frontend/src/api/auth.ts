const COOKIE_NAME = 'token';

export const getAuthToken = (): string | null => {
  const token = document.cookie.split('; ').find(row => row.startsWith(`${COOKIE_NAME}=`));
  return token ? token.split('=')[1] : null;
};

export const setAuthToken = (token: string, expiresIn: number = 86400): void => {
  const expires = new Date(Date.now() + expiresIn * 1000).toUTCString();
  document.cookie = `${COOKIE_NAME}=${token}; expires=${expires}; path=/; SameSite=Strict; Secure=${process.env.NODE_ENV === 'production'}`;
};


export const removeAuthToken = (): void => {
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict; Secure`;
};

export const redirectToSignIn = (redirectPath = '/'): void => {
  localStorage.removeItem('user');
  removeAuthToken();
  window.location.href = redirectPath;
};
