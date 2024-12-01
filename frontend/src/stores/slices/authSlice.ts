import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';
import { setAuthToken, removeAuthToken, getAuthToken } from '../../api/auth';
import { extractErrorMessage } from '../../utils/errorHandler';

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

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
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
    setAuthToken(data.token); // Save token in cookies and localStorage
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
    setAuthToken(data.token); // Save token in cookies and localStorage
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
      console.error('[Auth] Logout failed:', error);
      return rejectWithValue('Failed to log out.');
    } finally {
      // Clear all auth states
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

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ user: User; token: string }>) {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(user));
      setAuthToken(token);
    },
    clearAuthState(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('user');
      removeAuthToken();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { user, token } = action.payload;
        state.loading = false;
        state.user = user;
        state.token = token;
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
        const { user, token } = action.payload;
        state.loading = false;
        state.user = user;
        state.token = token;
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
      })
      .addCase(logout.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload || 'Failed to log out.';
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.error = action.payload || 'Google login failed.';
      });
  },
});

export const { setUser, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
