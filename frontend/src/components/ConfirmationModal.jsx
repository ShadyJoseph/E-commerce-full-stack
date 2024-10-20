import React from 'react';
import Loader from './Loader'; 

const ConfirmationModal = ({ message, onConfirm, onCancel, isLoading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4">
        <h2 className="text-xl font-semibold">{message}</h2>
        {isLoading ? (
          <Loader height="40" width="40" color="#3498db" />
        ) : (
          <div className="flex justify-center space-x-4">
            <button
              onClick={onConfirm}
              className={`py-2 px-4 rounded ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
              disabled={isLoading}
            >
              Yes
            </button>
            <button
              onClick={onCancel}
              className={`py-2 px-4 rounded ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-600 text-white hover:bg-gray-700'}`}
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
