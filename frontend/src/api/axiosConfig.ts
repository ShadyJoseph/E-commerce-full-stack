import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getAuthToken, redirectToSignIn } from './auth';

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
    if (error.response?.status === 401) {
      console.warn('Unauthorized request. Redirecting to sign-in.');
      redirectToSignIn();
    } else {
      console.error('API error:', error);
    }
    return Promise.reject(error);
  }
);

export default api;
