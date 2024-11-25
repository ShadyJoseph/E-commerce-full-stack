import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axiosConfig';
import { getAuthToken, setAuthToken, removeAuthToken } from '../api/auth';

interface User {
  id: string;
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
  setAuthToken: (token: string) => void;
  setUser: (user: User) => void;
}

const handleError = (error: any): string => {
  return error.response?.data?.message || error.message || 'An error occurred';
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: getAuthToken(),
      isAuthenticated: !!getAuthToken(),

      login: async (email, password) => {
        try {
          const { data } = await api.post('/auth/login', { email, password });
          const { token, user } = data;

          get().setAuthToken(token); // Save token and update headers
          set({ user, isAuthenticated: true });
          return true;
        } catch (error: any) {
          console.error('Login failed:', handleError(error));
          throw new Error(handleError(error));
        }
      },

      googleLogin: () => {
        const redirectUri = `${process.env.REACT_APP_FRONTEND_URL}/google/callback`;
        const authUrl = `${process.env.REACT_APP_API_URL}/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
        window.location.href = authUrl;
      },

      signUp: async (email, password, displayName) => {
        try {
          const { data } = await api.post('/auth/signup', { email, password, displayName });
          const { token, user } = data;

          get().setAuthToken(token); // Save token and update headers
          set({ user, isAuthenticated: true });
          return true;
        } catch (error: any) {
          console.error('Signup failed:', handleError(error));
          throw new Error(handleError(error));
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');

          // Clear all stored data
          useAuthStore.persist.clearStorage();
          removeAuthToken();
          set({ user: null, token: null, isAuthenticated: false });
        } catch (error: any) {
          console.error('Logout failed:', handleError(error));
          throw new Error('Logout failed');
        }
      },

      setAuthToken: (token: string) => {
        setAuthToken(token); // Save token
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({ token, isAuthenticated: !!token });
      },

      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
