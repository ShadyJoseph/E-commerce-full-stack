import React from "react";
import { useThemeStore } from "../stores/themeStore";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const { darkMode } = useThemeStore((state) => state);
  const navigate = useNavigate();

  return (
    <div className={`flex items-center justify-center min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"} transition-colors`}>
      <div className={`text-center p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"} transition-all`}>
        <h1 className="text-5xl font-extrabold mb-4 animate-bounce">404</h1>
        <p className="text-xl font-semibold mb-4">Page Not Found</p>
        <p className="text-sm mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate("/")}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${darkMode ? "bg-blue-600 text-gray-100 hover:bg-blue-700" : "bg-blue-500 text-white hover:bg-blue-600"}`}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
