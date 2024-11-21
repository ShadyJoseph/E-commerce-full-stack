import { create } from 'zustand';
import api from '../api/axiosConfig';

// Define the UserProfile interface
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: string;
  addresses: Address[]; // Make addresses an array of Address objects
  // Add other fields as required
}

// Define the state and actions
interface UserProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  getProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>, password?: string) => Promise<void>;
}

// Create the Zustand store
export const useUserProfileStore = create<UserProfileState>((set) => ({
  profile: null,
  loading: false,
  error: null,

  // Action to get the user profile
  getProfile: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('users/profile');
      set({ profile: response.data.user, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch profile', loading: false });
    }
  },

  // Action to update the user profile
  updateProfile: async (data, password) => {
    set({ loading: true, error: null });
    try {
      const payload = password ? { ...data, password } : data;
      const response = await api.put('users/profile', payload);
      set({ profile: response.data.user, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update profile', loading: false });
    }
  },
}));
