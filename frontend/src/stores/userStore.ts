// stores/authStore.ts
import create from 'zustand';
import api from '../api/axiosConfig';

interface User {
  email: string;
  displayName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: () => void;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      set({ user, token, isAuthenticated: true });
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error("Login failed:", error);
    }
  },

  googleLogin: () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  },

  signUp: async (email, password, displayName) => {
    try {
      const response = await api.post('/auth/signup', { email, password, displayName });
      const { token, user } = response.data;

      set({ user, token, isAuthenticated: true });
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error("Signup failed:", error);
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      set({ user: null, token: null, isAuthenticated: false });
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },
}));
