// Get the auth token from cookies
export const getAuthToken = (): string | null => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    return token ? token.split('=')[1] : null;
  };
  
  // Set auth token in cookies
  export const setAuthToken = (token: string, expiresIn: number = 86400): void => {
    const expires = new Date(Date.now() + expiresIn * 1000).toUTCString();
    document.cookie = `token=${token}; expires=${expires}; path=/; SameSite=Strict; Secure`;
  };
  
  // Remove auth token from cookies
  export const removeAuthToken = (): void => {
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict; Secure`;
  };
  
  // Redirect to sign-in page
  export const redirectToSignIn = (): void => {
    localStorage.removeItem('user');
    removeAuthToken();
    window.location.href = '/signin';
  };
  