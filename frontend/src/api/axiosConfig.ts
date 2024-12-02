import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { clearAuthState } from '../stores/slices/authSlice';
import { removeAuthToken,getAuthToken } from './auth';

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

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!store) {
      console.warn('[API] Store is not initialized yet. Skipping token injection.');
      return config;
    }
    const state = store.getState();
    const token = state?.auth?.token || getAuthToken(); // Fallback to cookie
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[API] Authorization token attached to headers:', token);
    } else {
      console.warn('[API] No token found in state or cookie.');
    }
    return config;
  },
  (error) => {
    console.error('[API] Request interceptor error:', error);
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('[API] Response received:', response);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    console.error('[API] Response interceptor error:', error);
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
