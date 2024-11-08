import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiShoppingCart } from 'react-icons/fi';
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';
import Logo from '../assets/Logo.png';
import ThemeToggleButton from './ThemeToggleButton';
import LogoutButton from './LogoutButton';
import { useThemeStore } from '../stores/themeStore';
import { useAuthStore } from '../stores/authStore';
import MobileMenu from './MobileMenu';
import Categories from './fullScreenCategories';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { darkMode } = useThemeStore();
  const { isAuthenticated } = useAuthStore();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-20 shadow-lg transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <img className="h-10 w-10 rounded-full shadow-lg" src={Logo} alt="Logo" />
              <span className="text-2xl font-semibold tracking-wide text-primaryColor">
                Your Brand
              </span>
            </Link>
          </div>

          {/* Desktop Categories */}
          <div className="hidden md:flex items-center space-x-4">
            <Categories />
          </div>

          {/* Action Icons */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="text-lg transition-colors transition-transform transform hover:scale-110 hover:text-primaryColor"
                  aria-label="Profile"
                >
                  <FiUser className="w-6 h-6" />
                </Link>
                <Link
                  to="/cart"
                  className="text-lg transition-colors transition-transform transform hover:scale-110 hover:text-primaryColor"
                  aria-label="Cart"
                >
                  <FiShoppingCart className="w-6 h-6" />
                </Link>
                <LogoutButton />
              </>
            ) : (
              <Link
                to="/signup"
                className="font-medium text-lg hover:text-primaryColor"
                aria-label="Register"
              >
                Register
              </Link>
            )}
            <ThemeToggleButton />
          </div>
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-2xl p-2 rounded focus:outline-none hover:scale-110"
            aria-label={isMobileMenuOpen ? 'Close Mobile Menu' : 'Open Mobile Menu'}
          >
            {isMobileMenuOpen ? (
              <HiOutlineX className="w-8 h-8 text-primaryColor" />
            ) : (
              <HiOutlineMenuAlt3 className="w-8 h-8 text-primaryColor" />
            )}
          </button>
        </div>
      </div>

      <MobileMenu isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
    </nav>
  );
};

export default Navbar;
