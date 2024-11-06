import { useThemeStore } from '../stores/themeStore';

const ThemeToggleButton = () => {
  const { darkMode, toggleDarkMode } = useThemeStore();
  
  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-md transition-colors duration-300 focus:outline-none"
      aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
    >
      {darkMode ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v3m6.364-1.636l-2.121 2.121m2.121 5.121l-2.121 2.121m-3 3h-3m-6.364-1.636l2.121 2.121m-2.121 5.121l2.121 2.121m9-9.121V21m-9-18h0a6 6 0 10-6 6 6 6 0 006-6z" />
        </svg> // Dark mode icon (moon)
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v2m6.364 1.636l-1.414 1.414m2.828 5.95a8 8 0 10-6.364-6.364m-4.95 1.414a6 6 0 1112 0z" />
        </svg> // Light mode icon (sun)
      )}
    </button>
  );
};

export default ThemeToggleButton;
