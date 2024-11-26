import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { store } from '../stores/store';  // Import store here instead of accessing it directly in the interceptor
import { clearAuthState } from '../stores/slices/authSlice';
import { removeAuthToken } from './auth';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from Redux state directly in the interceptor
    const state = store.getState();
    const token = state.auth.token; // Access token from Redux state
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[API] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const status = error.response?.status;
    if (!error.response) {
      console.error('[API] Network/Client error:', error.message);
    } else {
      console.error('[API] Server error:', error.response.data || error.message);
    }

    if (status === 401) {
      console.warn('[API] Unauthorized request. Logging out user.');
      store.dispatch(clearAuthState());
      removeAuthToken();
      const redirectPath = process.env.REACT_APP_SIGNIN_PATH || '/signin';
      window.location.href = redirectPath;
    }
    return Promise.reject(error);
  }
);

export default api;
