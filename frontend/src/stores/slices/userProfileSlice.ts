import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

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

interface UserProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

// Async Thunks for API calls
export const getProfile = createAsyncThunk(
  'userProfile/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/profile');
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'userProfile/updateProfile',
  async (data: Partial<UserProfile> & { password?: string }, { rejectWithValue }) => {
    try {
      const payload = data.password ? { ...data, password: data.password } : data;
      const response = await api.put('/users/profile', payload);
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred');
    }
  }
);

export const addAddress = createAsyncThunk(
  'userProfile/addAddress',
  async (address: Address, { getState, rejectWithValue }) => {
    try {
      const currentProfile = (getState() as { userProfile: UserProfileState }).userProfile.profile;
      const updatedAddresses = [...(currentProfile?.addresses || []), address];
      const response = await api.put('/users/profile', { addresses: updatedAddresses });
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred');
    }
  }
);

export const removeAddress = createAsyncThunk(
  'userProfile/removeAddress',
  async (index: number, { getState, rejectWithValue }) => {
    try {
      const currentProfile = (getState() as { userProfile: UserProfileState }).userProfile.profile;
      const updatedAddresses = currentProfile?.addresses.filter((_, i) => i !== index) || [];
      const response = await api.put('/users/profile', { addresses: updatedAddresses });
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred');
    }
  }
);

export const clearProfile = createAsyncThunk(
  'userProfile/clearProfile',
  async (_, { rejectWithValue }) => {
    return null;
  }
);

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: {
    profile: null,
    loading: false,
    error: null,
  } as UserProfileState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(getProfile.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(updateProfile.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Add address
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(addAddress.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Remove address
      .addCase(removeAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeAddress.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(removeAddress.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Clear profile
      .addCase(clearProfile.fulfilled, (state) => {
        state.profile = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export default userProfileSlice.reducer;
