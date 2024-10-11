// src/types/express.d.ts
import { IUser } from '../models/user'; // Adjust the path as necessary

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}
