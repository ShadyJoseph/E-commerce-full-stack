import { create } from 'zustand';
import api from '../api/axiosConfig';
import { getAuthToken, setAuthToken, removeAuthToken } from '../api/endpoints/auth';

interface User {
  email: string;
  displayName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  googleLogin: () => void;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set: (partial: Partial<AuthState>) => void) => ({
  user: null,
  token: getAuthToken(),
  isAuthenticated: !!getAuthToken(),

  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      set({ user, token, isAuthenticated: true });
      setAuthToken(token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return true; // Indicate successful login
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  googleLogin: () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  },

  signUp: async (email: string, password: string, displayName: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/signup', { email, password, displayName });
      const { token, user } = response.data;

      set({ user, token, isAuthenticated: true });
      setAuthToken(token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return true; // Indicate successful signup
    } catch (error: any) {
      console.error("Signup failed:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      set({ user: null, token: null, isAuthenticated: false });
      removeAuthToken();
      delete api.defaults.headers.common['Authorization'];
    } catch (error: any) {
      console.error("Logout failed:", error.response?.data?.message || error.message);
      throw new Error('Logout failed');
    }
  },
}));
