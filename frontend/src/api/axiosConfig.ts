import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getAuthToken, redirectToSignIn } from './auth';
import { useAuthStore } from '../stores/authStore';
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 15000, // Timeout after 15 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || error.message;

    if (status === 401) {
      if (errorMessage === 'Token expired, please log in again') {
        console.warn('Token expired. Logging out user.');
        const authStore = useAuthStore.getState(); // Access Zustand store
        authStore.logout(); // Call logout to clear state
      } else {
        console.warn('Unauthorized request. Redirecting to sign-in.');
        redirectToSignIn();
      }
    } else if (status === 403) {
      console.error('Access denied. Redirecting to sign-in.');
      redirectToSignIn();
    } else {
      console.error('API error:', error);
    }

    return Promise.reject(error);
  }
);

export default api;
