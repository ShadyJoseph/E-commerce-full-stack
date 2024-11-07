import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import { useAuthStore } from '../stores/authStore';

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
          className="fixed inset-0 z-10 flex flex-col items-center pt-24 space-y-6 bg-gray-800 bg-opacity-90 text-white transition-all duration-300 ease-in-out"
          role="menu"
          aria-labelledby="mobile-menu"
        >
          <h2 id="mobile-menu" className="sr-only">Mobile Menu</h2>
          
          {/* Menu Links */}
          {['Home', 'Men', 'Women', 'Kids'].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              onClick={toggleMobileMenu}
              className="text-lg font-semibold hover:underline tracking-wider transition-colors duration-200"
              aria-label={item}
            >
              {item}
            </Link>
          ))}
          
          {/* Conditional User Links */}
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                onClick={toggleMobileMenu}
                className="text-lg font-semibold hover:underline tracking-wider transition-colors duration-200"
                aria-label="Profile"
              >
                Profile
              </Link>
              <Link
                to="/cart"
                onClick={toggleMobileMenu}
                className="text-lg font-semibold hover:underline tracking-wider transition-colors duration-200"
                aria-label="Cart"
              >
                Cart
              </Link>
              <div onClick={toggleMobileMenu} className="mt-4">
                <LogoutButton />
              </div>
            </>
          ) : (
            <Link
              to="/signup"
              onClick={toggleMobileMenu}
              className="text-lg font-semibold hover:underline tracking-wider transition-colors duration-200"
              aria-label="Register"
            >
              Register
            </Link>
          )}
        </div>
      )}

      {/* Mobile Menu Close Button */}
      {isMobileMenuOpen && (
        <button
          onClick={toggleMobileMenu}
          className="fixed top-6 right-6 z-20 p-2 rounded-full bg-gray-800 text-white"
          aria-label="Close mobile menu"
        >
          <span className="text-2xl">&times;</span>
        </button>
      )}
    </>
  );
};

export default MobileMenu;
