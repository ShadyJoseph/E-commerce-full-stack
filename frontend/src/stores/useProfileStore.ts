import { create } from 'zustand';
import api from '../api/axiosConfig';

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
  getProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>, password?: string) => Promise<void>;
  addAddress: (address: Address) => Promise<void>;
  removeAddress: (index: number) => Promise<void>;
  clearProfile: () => void;
}

const handleError = (error: any): string => {
  return error.response?.data?.message || error.message || 'An error occurred';
};

export const useUserProfileStore = create<UserProfileState>((set, get) => ({
  profile: null,
  loading: false,
  error: null,

  // Fetch user profile from the API
  getProfile: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/users/profile');
      set({ profile: response.data.user, loading: false });
    } catch (error: any) {
      set({ error: handleError(error), loading: false });
    }
  },

  // Update user profile with optional password change
  updateProfile: async (data, password) => {
    set({ loading: true, error: null });
    try {
      const payload = password ? { ...data, password } : data;
      const response = await api.put('/users/profile', payload);

      set({ profile: response.data.user, loading: false });
    } catch (error: any) {
      set({ error: handleError(error), loading: false });
    }
  },

  // Add a new address to the user's profile
  addAddress: async (address) => {
    set({ loading: true, error: null });
    try {
      const updatedAddresses = [...(get().profile?.addresses || []), address];
      const response = await api.put('/users/profile', { addresses: updatedAddresses });

      set({ profile: response.data.user, loading: false });
    } catch (error: any) {
      set({ error: handleError(error), loading: false });
    }
  },

  // Remove an address by its index
  removeAddress: async (index) => {
    set({ loading: true, error: null });
    try {
      const currentAddresses = get().profile?.addresses || [];
      const updatedAddresses = currentAddresses.filter((_, i) => i !== index);

      const response = await api.put('/users/profile', { addresses: updatedAddresses });
      set({ profile: response.data.user, loading: false });
    } catch (error: any) {
      set({ error: handleError(error), loading: false });
    }
  },

  // Clear the profile from the store
  clearProfile: () => {
    set({ profile: null, loading: false, error: null });
  },
}));
