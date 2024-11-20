import jwt from 'jsonwebtoken';

const generateToken = (
  userId: string,
  role: string,
  options: { issuer?: string; audience?: string } = {}
) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET!,
    {
      expiresIn: '1d',
      issuer: options.issuer,
      audience: options.audience,
    }
  );
};

export default generateToken;
