import { Request, Response } from 'express';

const handleSessionLogout = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    if (!res.headersSent) {
      return res.status(401).json({ message: 'You must be logged in to log out' });
    }
  }

  req.logout((err) => {
    if (err) {
      if (!res.headersSent) {
        return res.status(500).json({ message: 'Logout error' });
      }
    }

    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        if (!res.headersSent) {
          return res.status(500).json({ message: 'Error clearing session' });
        }
      }

      if (!res.headersSent) {
        res.clearCookie('connect.sid'); // Clear session cookie for session-based auth
        res.clearCookie('token'); // Clear token cookie if set
        res.status(200).json({ message: 'Logged out successfully' });
      }
    });
  });
};

export default handleSessionLogout;
