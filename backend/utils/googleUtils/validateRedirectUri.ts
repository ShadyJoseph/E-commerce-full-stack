const validateRedirectUri = (redirectUri: string | undefined): string | null => {
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

  if (!redirectUri || !redirectUri.startsWith(FRONTEND_URL)) return null;
  return redirectUri;
};

export default validateRedirectUri;
