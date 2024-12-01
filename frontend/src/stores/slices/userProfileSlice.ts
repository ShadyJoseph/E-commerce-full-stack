import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';
import { extractErrorMessage } from '../../utils/errorHandler'; // Utility for error handling
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
// Initial State
const initialState: UserProfileState = {
  profile: null,
  loading: false,
  error: null,
};

export const getProfile = createAsyncThunk<UserProfile, void, { rejectValue: string }>(
  'userProfile/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/users/profile');
      localStorage.setItem('user', JSON.stringify(data.user)); // Save user to localStorage
      return data.user;
    } catch (error:any) {
      if (error.response?.status === 401) {
        store.dispatch(clearAuthState()); // Handle unauthorized error
      }
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch user profile.'));
    }
  }
);


export const updateProfile = createAsyncThunk<UserProfile, Partial<UserProfile> & { password?: string }, { rejectValue: string }>(
  'userProfile/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      const { password, ...rest } = data;
      const payload = password ? { ...rest, password } : rest;
      const { data: response } = await api.put('/users/profile', payload);
      return response.user;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to update user profile.'));
    }
  }
);

export const addAddress = createAsyncThunk<UserProfile, Address, { rejectValue: string; state: { userProfile: UserProfileState } }>(
  'userProfile/addAddress',
  async (address, { getState, rejectWithValue }) => {
    try {
      const currentProfile = getState().userProfile.profile;
      const updatedAddresses = [...(currentProfile?.addresses || []), address];
      const { data } = await api.put('/users/profile', { addresses: updatedAddresses });
      return data.user;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to add address.'));
    }
  }
);

export const removeAddress = createAsyncThunk<UserProfile, number, { rejectValue: string; state: { userProfile: UserProfileState } }>(
  'userProfile/removeAddress',
  async (index, { getState, rejectWithValue }) => {
    try {
      const currentProfile = getState().userProfile.profile;
      const updatedAddresses = currentProfile?.addresses.filter((_, i) => i !== index) || [];
      const { data } = await api.put('/users/profile', { addresses: updatedAddresses });
      return data.user;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to remove address.'));
    }
  }
);

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    // Simple reducer for clearing the profile
    clearProfile(state) {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(getProfile.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || 'An unexpected error occurred.';
        state.loading = false;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(updateProfile.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || 'An unexpected error occurred.';
        state.loading = false;
      })

      // Add Address
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(addAddress.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || 'An unexpected error occurred.';
        state.loading = false;
      })

      // Remove Address
      .addCase(removeAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeAddress.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(removeAddress.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || 'An unexpected error occurred.';
        state.loading = false;
      });
  },
});

export const { clearProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;
