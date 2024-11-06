import { create } from 'zustand';

interface ThemeState {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  // Load the darkMode preference from localStorage, default to true if not set
  darkMode: localStorage.getItem('darkMode') === 'true' || false, // Default is true (dark mode)
  toggleDarkMode: () => {
    set((state) => {
      const newDarkMode = !state.darkMode;
      // Persist the new theme preference to localStorage
      localStorage.setItem('darkMode', newDarkMode.toString());
      return { darkMode: newDarkMode };
    });
  },
}));
