import React from "react";
import { useThemeStore } from "../stores/themeStore"; // Import theme store

const NotFound: React.FC = () => {
  // Access the darkMode state from Zustand store
  const { darkMode } = useThemeStore((state) => state);

  return (
    <div className={`flex items-center justify-center min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"} transition-colors`}>
      <div className={`text-center ${darkMode ? "text-gray-100" : "text-gray-800"} p-6 rounded-lg shadow-lg`}>
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-lg mb-6">Page Not Found</p>
        <p className="text-sm">
          The page you are looking for doesn't exist or has been moved.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
