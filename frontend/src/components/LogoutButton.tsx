import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { useAuthStore } from '../stores/authStore';

const LogoutButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      setIsLoading(false);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-red-600 font-medium hover:underline"
      >
        Logout
      </button>

      {isModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to log out?"
          onConfirm={handleLogout}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default LogoutButton;
