// MobileMenu.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineX } from 'react-icons/hi';
import { FiUser, FiShoppingCart } from 'react-icons/fi';
import LogoutButton from './LogoutButton';
import { useAuthStore } from '../stores/authStore';
import CategoriesMenu from './MobileMenuCategories';
import ThemeToggleButton from './ThemeToggleButton'; // Import the theme toggle button

interface MobileMenuProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isMobileMenuOpen, toggleMobileMenu }) => {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-10 flex flex-col items-center pt-20 pb-6 bg-gray-900 bg-opacity-95 text-white transition-transform duration-300 ease-in-out"
          role="menu"
          aria-labelledby="mobile-menu"
        >
          <h2 id="mobile-menu" className="sr-only">Mobile Menu</h2>

          {/* Categories Menu */}
          <CategoriesMenu onClick={toggleMobileMenu} isMobile />

          {/* Conditional User Links with Icons */}
          {isAuthenticated ? (
            <div className="flex flex-col items-center space-y-6 mt-6">
              <Link
                to="/profile"
                onClick={toggleMobileMenu}
                className="text-lg transition-colors transform hover:scale-110 hover:text-primaryColor"
                aria-label="Profile"
              >
                <FiUser className="w-8 h-8" />
              </Link>
              <Link
                to="/cart"
                onClick={toggleMobileMenu}
                className="text-lg transition-colors transform hover:scale-110 hover:text-primaryColor"
                aria-label="Cart"
              >
                <FiShoppingCart className="w-8 h-8" />
              </Link>

              {/* Logout Button */}
              <LogoutButton />
            </div>
          ) : (
            <Link
              to="/signup"
              onClick={toggleMobileMenu}
              className="text-lg font-semibold tracking-wider hover:underline hover:text-primaryColor transition-all duration-200 ease-in-out mt-6"
              aria-label="Register"
            >
              Register
            </Link>
          )}

          {/* Theme Toggle Button */}
          <div className="mt-6">
            <ThemeToggleButton />
          </div>
        </div>
      )}

      {/* Mobile Menu Close Button */}
      {isMobileMenuOpen && (
        <button
          onClick={toggleMobileMenu}
          className="fixed top-6 right-6 z-20 p-2 rounded-full bg-gray-700 text-white transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primaryColor"
          aria-label="Close mobile menu"
        >
          <HiOutlineX className="w-8 h-8 text-primaryColor" />
        </button>
      )}
    </>
  );
};

export default MobileMenu;
