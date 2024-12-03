import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';
import { extractErrorMessage } from '../../utils/errorHandler';
import store from '../store';
import { clearAuthState } from './authSlice';

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: string;
  addresses: Address[];
  wishlist: string[];
}

export interface UserProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserProfileState = {
  profile: null,
  loading: false,
  error: null,
};

// Helper to handle common rejection scenarios
const handleRejection = (error: any, message: string, thunkAPI: any) => {
  if (error.response?.status === 401) {
    store.dispatch(clearAuthState());
  }
  return thunkAPI.rejectWithValue(extractErrorMessage(error, message));
};

// Fetch User Profile
export const getProfile = createAsyncThunk<UserProfile, void, { rejectValue: string }>(
  'userProfile/getProfile',
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get('/users/profile');
      localStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      return handleRejection(error, 'Failed to fetch user profile.', thunkAPI);
    }
  }
);

// Update User Profile
export const updateProfile = createAsyncThunk<
  UserProfile,
  Partial<UserProfile> & { password?: string },
  { rejectValue: string }
>('userProfile/updateProfile', async (data, thunkAPI) => {
  try {
    const { password, ...rest } = data;
    const payload = password ? { ...rest, password } : rest;
    const { data: response } = await api.put('/users/profile', payload);
    return response.user;
  } catch (error) {
    return handleRejection(error, 'Failed to update user profile.', thunkAPI);
  }
});

// Add Address
export const addAddress = createAsyncThunk<
  UserProfile,
  Address,
  { rejectValue: string; state: { userProfile: UserProfileState } }
>('userProfile/addAddress', async (address, thunkAPI) => {
  const { profile } = thunkAPI.getState().userProfile;
  if (!profile) {
    return thunkAPI.rejectWithValue('User profile not loaded.');
  }
  try {
    const updatedAddresses = [...profile.addresses, address];
    const { data } = await api.put('/users/profile', { addresses: updatedAddresses });
    return data.user;
  } catch (error) {
    return handleRejection(error, 'Failed to add address.', thunkAPI);
  }
});

// Remove Address
export const removeAddress = createAsyncThunk<
  UserProfile,
  number,
  { rejectValue: string; state: { userProfile: UserProfileState } }
>('userProfile/removeAddress', async (index, thunkAPI) => {
  const { profile } = thunkAPI.getState().userProfile;
  if (!profile) {
    return thunkAPI.rejectWithValue('User profile not loaded.');
  }
  try {
    const updatedAddresses = profile.addresses.filter((_, i) => i !== index);
    const { data } = await api.put('/users/profile', { addresses: updatedAddresses });
    return data.user;
  } catch (error) {
    return handleRejection(error, 'Failed to remove address.', thunkAPI);
  }
});

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    clearProfile(state) {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.startsWith('userProfile/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('userProfile/') && action.type.endsWith('/fulfilled'),
        (state, action: PayloadAction<UserProfile>) => {
          state.profile = action.payload;
          state.loading = false;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('userProfile/') && action.type.endsWith('/rejected'),
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload || 'An unexpected error occurred.';
          state.loading = false;
        }
      );
  },
});

export const { clearProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;
