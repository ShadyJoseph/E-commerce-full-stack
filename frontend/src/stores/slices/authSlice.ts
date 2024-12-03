import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';
import { setAuthToken, removeAuthToken, getAuthToken } from '../../api/auth';
import { extractErrorMessage } from '../../utils/errorHandler';

// Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: getAuthToken(),
  isAuthenticated: !!getAuthToken(),
  loading: false,
  error: null,
};

// Helper Functions
const handlePending = (state: AuthState) => {
  state.loading = true;
  state.error = null;
};

const handleFulfilled = (state: AuthState, user: User, token: string) => {
  state.user = user;
  state.token = token;
  state.isAuthenticated = true;
  state.loading = false;
  localStorage.setItem('user', JSON.stringify(user));
  setAuthToken(token);
};

const handleRejected = (state: AuthState, error: string) => {
  state.loading = false;
  state.error = error;
};

// Async Thunks
export const login = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    setAuthToken(data.token);
    return data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'Failed to log in.'));
  }
});

export const signUp = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string; displayName: string },
  { rejectValue: string }
>('auth/signUp', async ({ email, password, displayName }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/signup', { email, password, displayName });
    setAuthToken(data.token);
    return data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'Failed to sign up.'));
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      return rejectWithValue('Failed to log out.');
    } finally {
      dispatch(clearAuthState());
    }
  }
);

export const googleLogin = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/googleLogin',
  async (_, { rejectWithValue }) => {
    try {
      const redirectUri = `${process.env.REACT_APP_FRONTEND_URL}/google/callback`;
      const authUrl = `${process.env.REACT_APP_API_URL}/auth/google?redirect_uri=${encodeURIComponent(
        redirectUri
      )}`;
      window.location.href = authUrl;
    } catch (error) {
      return rejectWithValue('Failed to initiate Google login.');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ user: User; token: string }>) {
      const { user, token } = action.payload;
      handleFulfilled(state, user, token);
      console.log('[Auth Slice] User set successfully:', user);
    },
    clearAuthState(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('user');
      removeAuthToken();
      console.log('[Auth Slice] Auth state cleared.');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, handlePending)
      .addCase(login.fulfilled, (state, action) => {
        const { user, token } = action.payload;
        handleFulfilled(state, user, token);
        console.log('[Auth Slice] Login successful. User:', user);
      })
      .addCase(login.rejected, (state, action) => {
        handleRejected(state, action.payload || 'Unexpected error occurred.');
        console.error('[Auth Slice] Login failed:', state.error);
      })
      // Signup
      .addCase(signUp.pending, handlePending)
      .addCase(signUp.fulfilled, (state, action) => {
        const { user, token } = action.payload;
        handleFulfilled(state, user, token);
        console.log('[Auth Slice] Signup successful. User:', user);
      })
      .addCase(signUp.rejected, (state, action) => {
        handleRejected(state, action.payload || 'Unexpected error occurred.');
        console.error('[Auth Slice] Signup failed:', state.error);
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        console.log('[Auth Slice] Logout successful.');
      })
      .addCase(logout.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        handleRejected(state, action.payload || 'Failed to log out.');
        console.error('[Auth Slice] Logout failed.');
      })
      // Google Login
      .addCase(googleLogin.rejected, (state, action) => {
        handleRejected(state, action.payload || 'Google login failed.');
        console.error('[Auth Slice] Google login failed.');
      });
  },
});

export const { setUser, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
