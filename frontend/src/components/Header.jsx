import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { MdHome, MdWork, MdPerson, MdPostAdd, MdLogin, MdPersonAdd, MdLogout, MdMenu, MdClose, MdInfo } from 'react-icons/md';
import Logo from '../assets/logo.avif';
import ConfirmationModal from './ConfirmationModal';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { state: { isAuthenticated, user }, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      logout();
      setIsLoading(false);
      setShowLogoutConfirm(false);
    }, 1000);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  return (
    <header className="bg-green-700 fixed top-0 left-0 right-0 z-10 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <Link to="/">
            <img src={Logo} alt="App Logo" className="h-12 w-auto" />
          </Link>
          <h1 className="text-white text-3xl font-extrabold">
            <Link to="/" className="hover:text-yellow-300 transition duration-200">
              Good Grabs
            </Link>
          </h1>
        </div>

        {/* Hamburger Menu Icon */}
        <div className="block md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none">
            {menuOpen ? <MdClose className="h-6 w-6" /> : <MdMenu className="h-6 w-6" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className={`md:flex items-center space-x-8 ${menuOpen ? 'block' : 'hidden'} md:block md:static absolute top-16 left-0 right-0 bg-green-700 md:bg-transparent transition-all duration-300 ease-in-out md:shadow-none shadow-lg md:w-auto w-full`}>
          <div className="flex flex-col md:flex-row">
            <NavLink
              to="/"
              onClick={handleMenuClose}
              className={({ isActive }) =>
                isActive ? 'text-yellow-300 font-semibold flex items-center space-x-2 p-4' : 'text-white hover:text-yellow-300 transition duration-200 flex items-center space-x-2 p-4'
              }
            >
              <MdHome className="h-5 w-5" />
              <span>Home</span>
            </NavLink>

            {/* Show Cart link only when authenticated */}
            {isAuthenticated && (
              <>
                <NavLink
                  to="/cart"
                  onClick={handleMenuClose}
                  className={({ isActive }) =>
                    isActive ? 'text-yellow-300 font-semibold flex items-center space-x-2 p-4' : 'text-white hover:text-yellow-300 transition duration-200 flex items-center space-x-2 p-4'
                  }
                >
                  <MdWork className="h-5 w-5" />
                  <span>Cart</span>
                </NavLink>

                <NavLink
                  to="/profile"
                  onClick={handleMenuClose}
                  className={({ isActive }) =>
                    isActive ? 'text-yellow-300 font-semibold flex items-center space-x-2 p-4' : 'text-white hover:text-yellow-300 transition duration-200 flex items-center space-x-2 p-4'
                  }
                >
                  <MdPerson className="h-5 w-5" />
                  <span>{user.firstName}'s Profile</span>
                </NavLink>

                {/* About Us link */}
                <NavLink
                  to="/aboutus"
                  onClick={handleMenuClose}
                  className={({ isActive }) =>
                    isActive ? 'text-yellow-300 font-semibold flex items-center space-x-2 p-4' : 'text-white hover:text-yellow-300 transition duration-200 flex items-center space-x-2 p-4'
                  }
                >
                  <MdInfo className="h-5 w-5" />
                  <span>About Us</span>
                </NavLink>

                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="text-white hover:text-yellow-300 transition duration-200 focus:outline-none font-semibold flex items-center space-x-2 p-4"
                >
                  <MdLogout className="h-5 w-5" />
                  <span>Logout</span>
                </button>

                {user.role === 1 && (
                  <NavLink
                    to="/post-item"
                    onClick={handleMenuClose}
                    className={({ isActive }) =>
                      isActive ? 'text-yellow-300 font-semibold flex items-center space-x-2 p-4' : 'text-white hover:text-yellow-300 transition duration-200 flex items-center space-x-2 p-4'
                    }
                  >
                    <MdPostAdd className="h-5 w-5" />
                    <span>Post an Item</span>
                  </NavLink>
                )}
              </>
            )}

            {/* Non-authenticated links */}
            {!isAuthenticated && (
              <>
                <NavLink
                  to="/signin"
                  onClick={handleMenuClose}
                  className={({ isActive }) =>
                    isActive ? 'text-yellow-300 font-semibold flex items-center space-x-2 p-4' : 'text-white hover:text-yellow-300 transition duration-200 flex items-center space-x-2 p-4'
                  }
                >
                  <MdLogin className="h-5 w-5" />
                  <span>Sign In</span>
                </NavLink>
                <NavLink
                  to="/signup"
                  onClick={handleMenuClose}
                  className={({ isActive }) =>
                    isActive ? 'text-yellow-300 font-semibold flex items-center space-x-2 p-4' : 'text-white hover:text-yellow-300 transition duration-200 flex items-center space-x-2 p-4'
                  }
                >
                  <MdPersonAdd className="h-5 w-5" />
                  <span>Register</span>
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <ConfirmationModal
          message="Are you sure you want to logout?"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
          isLoading={isLoading}
        />
      )}
    </header>
  );
};

export default Header;