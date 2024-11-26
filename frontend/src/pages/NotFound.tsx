import React from "react";
import { useAppSelector } from "../hooks/reduxHooks";
import { useNavigate } from "react-router-dom";
import { AiOutlineQuestionCircle } from "react-icons/ai"; // Import icon

const NotFound: React.FC = () => {
  const darkMode = useAppSelector((state: { theme: { darkMode: boolean } }) => state.theme.darkMode);
  const navigate = useNavigate();

  return (
    <div className={`flex items-center justify-center min-h-screen transition-colors ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"}`}>
      <div className={`text-center p-8 rounded-lg shadow-lg transform transition-all ${darkMode ? "bg-gray-800" : "bg-white"} animate-fadeIn`}>
        <AiOutlineQuestionCircle className="text-6xl mb-4 text-blue-500 animate-pulse" aria-label="Page Not Found Icon" />
        <h1 className="text-6xl font-extrabold mb-2">404</h1>
        <p className="text-xl font-semibold mb-4">Oops! Page Not Found</p>
        <p className="text-sm mb-6">
          We can't seem to find the page you're looking for. It might have been moved or no longer exists.
        </p>
        <button
          onClick={() => navigate("/")}
          className={`px-6 py-2 rounded-md font-medium shadow-md transition duration-150 ${darkMode ? "bg-blue-600 text-gray-100 hover:bg-blue-700" : "bg-blue-500 text-white hover:bg-blue-600"}`}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
