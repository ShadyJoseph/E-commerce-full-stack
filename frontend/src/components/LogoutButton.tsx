import React, { useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import ConfirmationModal from './ConfirmationModal';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { logout } from '../stores/slices/authSlice'; // Import the logout action

const LogoutButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch(); // Use custom dispatch hook
  const loading = useAppSelector((state) => state.auth.loading); // Use custom selector hook

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await dispatch(logout()).unwrap(); // Dispatch the logout action and wait for completion
    } catch (error: any) {  // Explicitly type error as `any`
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-lg transition-colors transition-transform transform hover:scale-110 hover:text-primaryColor"
        aria-label="Logout"
      >
        <FiLogOut className="w-6 h-6" />
      </button>

      {isModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to log out?"
          onConfirm={handleLogout}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isLoading || loading} // Show loading state from Redux
        />
      )}
    </>
  );
};

export default LogoutButton;
