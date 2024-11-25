import React, { useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import ConfirmationModal from './ConfirmationModal';
import { useAuthStore } from '../stores/authStore';
import api from '../api/axiosConfig';
const LogoutButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuthStore();

const handleLogout = async () => {
  setIsLoading(true);
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout failed or token expired:', error);
  } finally {
    useAuthStore.getState().logout(); // Ensure the logout logic is executed regardless
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
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default LogoutButton;
