import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getAuthToken, redirectToSignIn } from './auth';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to attach token from cookies
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();  // Get token from cookies
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;  // Attach token to request
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Response Interceptor to handle token expiration and errors
api.interceptors.response.use(
  (response: AxiosResponse) => response, // Keep the full response for type safety
  (error) => {
    if (error.response?.status === 401) {
      redirectToSignIn();
    }
    return Promise.reject(error);
  }
);

export default api;
