import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';
import { getAuthToken, setAuthToken, removeAuthToken } from '../../api/auth';

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
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: getAuthToken(),
  isAuthenticated: !!getAuthToken(),
  loading: false,
  error: null,
};

// Async Actions
export const login = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    setAuthToken(data.token); // Save token to cookies
    return data; // Expecting { user, token }
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to log in.';
    return rejectWithValue(message);
  }
});

export const signUp = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string; displayName: string },
  { rejectValue: string }
>('auth/signUp', async ({ email, password, displayName }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/signup', { email, password, displayName });
    setAuthToken(data.token); // Save token to cookies
    return data; // Expecting { user, token }
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to sign up.';
    return rejectWithValue(message);
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
      removeAuthToken(); // Assuming this removes the JWT token from localStorage or cookies
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to log out.';
      return rejectWithValue(message);
    }
  }
);

export const googleLogin = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/googleLogin',
  async (_, { rejectWithValue }) => {
    try {
      const redirectUri = `${process.env.REACT_APP_FRONTEND_URL}/google/callback`;
      const authUrl = `${process.env.REACT_APP_API_URL}/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
      window.location.href = authUrl; // Redirect to the OAuth URL
    } catch (error) {
      console.error('[Auth] Failed to redirect to Google login:', error);
      return rejectWithValue('Failed to initiate Google login');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuthState(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unexpected error occurred.';
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unexpected error occurred.';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload || 'Failed to log out.';
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.error = action.payload || 'Google login failed.';
      });
  },
});

export const { setUser, clearAuthState } = authSlice.actions;
export default authSlice.reducer;