import { useThemeStore } from '../stores/themeStore';
import { FaMoon, FaSun } from 'react-icons/fa';

const ThemeToggleButton = () => {
  const { darkMode, toggleDarkMode } = useThemeStore();

  return (
    <button
      onClick={toggleDarkMode}
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
