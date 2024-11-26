import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../stores/slices/themeSlice';
import { RootState } from '../stores/store';
import { FaMoon, FaSun } from 'react-icons/fa';

const ThemeToggleButton: React.FC = () => {
  // Access the current theme state using useSelector
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(toggleDarkMode()); // Dispatch action to toggle dark mode
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-md transition-colors duration-300 focus:outline-none 
                 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 
                 focus:ring-blue-500"
      aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
    >
      {darkMode ? (
        <FaMoon className="text-yellow-400 w-6 h-6 transition-transform duration-300" />
      ) : (
        <FaSun className="text-yellow-500 w-6 h-6 transition-transform duration-300" />
      )}
    </button>
  );
};

export default ThemeToggleButton;
