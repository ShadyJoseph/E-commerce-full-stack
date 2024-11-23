import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axiosConfig';
import { getAuthToken, setAuthToken, removeAuthToken } from '../api/auth';
import { useUserProfileStore } from './useProfileStore';

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

      // Login with email and password
      login: async (email, password) => {
        try {
          const { data } = await api.post('/auth/login', { email, password });
          const { token, user } = data;

          get().setAuthToken(token); // Save token and update headers
          set({ user, isAuthenticated: true });

          // Fetch and sync user profile
          await useUserProfileStore.getState().getProfile();
          return true;
        } catch (error: any) {
          console.error('Login failed:', handleError(error));
          throw new Error(handleError(error));
        }
      },

      // Redirect to Google OAuth login
      googleLogin: () => {
        const redirectUri = `${process.env.REACT_APP_FRONTEND_URL}/google/callback`;
        const authUrl = `${process.env.REACT_APP_API_URL}/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
        window.location.href = authUrl;
      },

      // Signup with email, password, and displayName
      signUp: async (email, password, displayName) => {
        try {
          const { data } = await api.post('/auth/signup', { email, password, displayName });
          const { token, user } = data;

          get().setAuthToken(token); // Save token and update headers
          set({ user, isAuthenticated: true });

          // Fetch and sync user profile
          await useUserProfileStore.getState().getProfile();
          return true;
        } catch (error: any) {
          console.error('Signup failed:', handleError(error));
          throw new Error(handleError(error));
        }
      },

      // Logout the user and clear all data
      logout: async () => {
        try {
          await api.post('/auth/logout');

          // Clear stores and remove token
          useAuthStore.persist.clearStorage();
          removeAuthToken();
          useUserProfileStore.getState().clearProfile();
          delete api.defaults.headers.common['Authorization'];

          set({ user: null, token: null, isAuthenticated: false });
        } catch (error: any) {
          console.error('Logout failed:', handleError(error));
          throw new Error('Logout failed');
        }
      },

      // Set and persist auth token
      setAuthToken: (token: string) => {
        setAuthToken(token); // Save token to storage
        api.defaults.headers.common['Authorization'] = token
          ? `Bearer ${token}`
          : undefined;
        set({ token, isAuthenticated: !!token });
      },

      // Set user data
      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage', // Key in localStorage
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
      // Rehydrate store and set headers
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
          useUserProfileStore.getState().getProfile().catch((error) => {
            console.error('Error fetching profile during rehydration:', handleError(error));
          });
        }
      },
    }
  )
);
