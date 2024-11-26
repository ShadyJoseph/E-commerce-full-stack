import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  darkMode: boolean;
}

const initialState: ThemeState = {
  // Load darkMode preference from localStorage, default to false
  darkMode: localStorage.getItem('darkMode') === 'true' || false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      // Persist to localStorage
      localStorage.setItem('darkMode', JSON.stringify(state.darkMode));
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
      // Persist to localStorage
      localStorage.setItem('darkMode', JSON.stringify(state.darkMode));
    },
  },
});

export const { toggleDarkMode, setDarkMode } = themeSlice.actions;

export default themeSlice.reducer;
