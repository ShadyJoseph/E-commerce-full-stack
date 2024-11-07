import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose, AiOutlineShoppingCart } from 'react-icons/ai';
import { FaUser } from 'react-icons/fa'; // Profile icon
import { FiLogOut } from 'react-icons/fi'; // Logout icon
import Logo from '../assets/Logo.png';
import ThemeToggleButton from './ThemeToggleButton';
import LogoutButton from './LogoutButton';
import { useThemeStore } from '../stores/themeStore';
import { useAuthStore } from '../stores/authStore';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { darkMode } = useThemeStore();
  const { user, isAuthenticated } = useAuthStore();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-10 transition-colors duration-300 shadow-md ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img className="h-10 w-10 rounded-full shadow-md" src={Logo} alt="Logo" />
              <span className="ml-3 text-xl font-bold tracking-wide">Your Brand</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden sm:flex sm:items-center space-x-8">
            {['Men', 'Women', 'Kids'].map((section) => (
              <Link
                key={section}
                to={`/${section.toLowerCase()}`}
                className="px-4 py-2 text-lg font-medium transition duration-300 hover:text-primaryColor"
              >
                {section}
              </Link>
            ))}
          </div>

          {/* Right Section (Cart, Theme Toggle, User Profile, etc.) */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {/* Profile Button */}
                <Link to="/profile" className="flex items-center text-lg font-medium transition duration-300 hover:text-primaryColor">
                  <FaUser className="w-6 h-6" />
                  <span className="ml-2">{user?.displayName || 'Profile'}</span>
                </Link>
                <Link to="/cart" className="flex items-center" aria-label="Cart">
                  <AiOutlineShoppingCart className="w-6 h-6 hover:text-primaryColor transition duration-300" />
                </Link>
                {/* Logout Icon */}
                <button
                  onClick={() => {/* Trigger logout action */}}
                  className="text-lg p-2 hover:text-primaryColor transition duration-300"
                  aria-label="Logout"
                >
                  <FiLogOut className="w-6 h-6" />
                </button>
              </>
            ) : (
              <Link to="/signup" className="font-medium hover:text-primaryColor">
                Register
              </Link>
            )}
            <ThemeToggleButton />

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="sm:hidden text-lg p-2 transition-transform hover:scale-110"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        } bg-gray-800 text-white`}
      >
        <div className="px-4 py-4 space-y-4">
          {['Men', 'Women', 'Kids'].map((section) => (
            <Link
              key={section}
              to={`/${section.toLowerCase()}`}
              className="block px-4 py-2 text-lg font-medium hover:bg-gray-700 rounded-md transition duration-300"
              onClick={toggleMobileMenu}
            >
              {section}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
