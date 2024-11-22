import { create } from 'zustand';
import api from '../api/axiosConfig';
import { useAuthStore } from './authStore';

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
  removeAddress: (addressId: string) => Promise<void>;
  clearProfile: () => void;
}

export const useUserProfileStore = create<UserProfileState>((set) => ({
  profile: JSON.parse(localStorage.getItem('profile') || 'null'),
  loading: false,
  error: null,

  getProfile: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/users/profile');
      const profile = response.data.user;

      localStorage.setItem('profile', JSON.stringify(profile));
      set({ profile, loading: false });

      useAuthStore.getState().setUser({
        id: profile.id,
        email: profile.email,
        displayName: profile.displayName,
        role: profile.role,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch profile',
        loading: false,
      });
    }
  },

  updateProfile: async (data, password) => {
    set({ loading: true, error: null });
    try {
      const payload = password ? { ...data, password } : data;
      const response = await api.put('/users/profile', payload);
      const profile = response.data.user;

      localStorage.setItem('profile', JSON.stringify(profile));
      set({ profile, loading: false });

      useAuthStore.getState().setUser({
        id: profile.id,
        email: profile.email,
        displayName: profile.displayName,
        role: profile.role,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update profile',
        loading: false,
      });
    }
  },

  addAddress: async (address) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put('/users/profile', {
        addresses: [...(useUserProfileStore.getState().profile?.addresses || []), address],
      });
      const profile = response.data.user;

      localStorage.setItem('profile', JSON.stringify(profile));
      set({ profile, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to add address',
        loading: false,
      });
    }
  },

  removeAddress: async (addressId) => {
    set({ loading: true, error: null });
    try {
      const updatedAddresses = useUserProfileStore
        .getState()
        .profile?.addresses.filter((_, index) => index !== parseInt(addressId, 10)) || [];

      const response = await api.put('/users/profile', { addresses: updatedAddresses });
      const profile = response.data.user;

      localStorage.setItem('profile', JSON.stringify(profile));
      set({ profile, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to remove address',
        loading: false,
      });
    }
  },

  clearProfile: () => {
    localStorage.removeItem('profile');
    set({ profile: null });
  },
}));
