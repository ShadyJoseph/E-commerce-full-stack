import React from 'react';
import Loader from './Loader';
import { useThemeStore } from '../stores/themeStore';

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  message,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  const { darkMode } = useThemeStore((state) => state);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-20 transition-opacity bg-black bg-opacity-50"
      style={{ backdropFilter: 'blur(4px)' }} // Adds a blur effect to the background
    >
      <div
        className={`p-6 rounded-lg shadow-lg text-center space-y-6 max-w-sm mx-4 transition-all duration-300 ${
          darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
        }`}
      >
        <h2 className="text-xl font-semibold">{message}</h2>

        {isLoading ? (
          <Loader height="40" width="40" />
        ) : (
          <div className="flex justify-center space-x-4">
            <button
              onClick={onConfirm}
              className={`py-2 px-6 rounded-lg font-medium transition-colors duration-200 ${
                darkMode
                  ? 'bg-red-700 hover:bg-red-600 text-white'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
              disabled={isLoading}
            >
              Yes
            </button>
            <button
              onClick={onCancel}
              className={`py-2 px-6 rounded-lg font-medium transition-colors duration-200 ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
              disabled={isLoading}
            >
              No
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmationModal;
