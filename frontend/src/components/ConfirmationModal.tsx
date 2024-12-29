import React from 'react';
import Loader from './Loader';
import { useAppSelector } from '../hooks/reduxHooks';
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
  const darkMode = useAppSelector((state: { theme: { darkMode: boolean } }) => state.theme.darkMode);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 m-0 p-0"
      style={{ margin: 0, padding: 0 }} // Ensure no margin or padding
    >
      <div
        className={`p-6 rounded-lg shadow-lg max-w-sm w-full mx-4 text-center space-y-6 transition-all duration-300 ${
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
                  : 'bg-red-600 hover:bg-red-700 text-white'
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
                  : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
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
