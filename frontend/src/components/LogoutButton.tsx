import React, { useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import ConfirmationModal from './ConfirmationModal';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { logout } from '../stores/slices/authSlice';

const LogoutButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.auth.loading);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-lg flex items-center space-x-2 hover:text-indigo-600 transform hover:scale-110 transition-transform duration-300"
        aria-label="Logout"
      >
        <FiLogOut className="w-6 h-6" />
      </button>

      {isModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to log out?"
          onConfirm={handleLogout}
          onCancel={() => setIsModalOpen(false)}
          isLoading={loading}
        />
      )}
    </>
  );
};


export default LogoutButton;
