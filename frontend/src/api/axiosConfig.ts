import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { clearAuthState } from '../stores/slices/authSlice';
import { removeAuthToken } from './auth';

let store: any; // Declare a variable to hold the store reference
export const setStore = (reduxStore: any) => {
  store = reduxStore; // Assign the store dynamically
};

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
    if (!store) return config; // Skip if store isn't initialized yet
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
    if (status === 401) {
      console.warn('[API] Unauthorized request. Logging out user.');
      if (store) store.dispatch(clearAuthState());
      removeAuthToken();
      const redirectPath = process.env.REACT_APP_SIGNIN_PATH || '/';
      window.location.href = redirectPath;
    }
    return Promise.reject(error);
  }
);

export default api;
