import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiShoppingCart } from "react-icons/fi";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import Logo from "../assets/Logo.png";
import ThemeToggleButton from "./ThemeToggleButton";
import LogoutButton from "./LogoutButton";
import MobileMenu from "./MobileMenu";
import Categories from "./fullScreenCategories";
import { useAppSelector } from "../hooks/reduxHooks";
import { RootState } from "../stores/store";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const darkMode = useAppSelector((state: RootState) => state.theme.darkMode);
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-20 shadow-md transition-colors duration-300 opacity-85 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <img
                className="h-10 w-10 rounded-full shadow-md transform hover:scale-110 transition-transform duration-300"
                src={Logo}
                alt="Logo"
              />
              <span className="text-2xl font-bold tracking-wide text-primaryColor hover:text-indigo-600 transition-colors duration-300">
                Your Brand
              </span>
            </Link>
          </div>
          {/* Desktop Categories */}
          <div className="hidden md:flex items-center space-x-6">
            <Categories />
          </div>
          {/* Action Icons */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="text-lg flex items-center space-x-2 hover:text-indigo-600 transform hover:scale-110 transition-transform duration-300"
                  aria-label="Profile"
                >
                  <FiUser className="w-6 h-6" />
                </Link>
                <Link
                  to="/cart"
                  className="text-lg flex items-center space-x-2 hover:text-indigo-600 transform hover:scale-110 transition-transform duration-300"
                  aria-label="Cart"
                >
                  <FiShoppingCart className="w-6 h-6" />
                </Link>
                <LogoutButton />
              </>
            ) : (
              <Link
                to="/signup"
                className="font-medium text-lg hover:text-indigo-600 transition-colors duration-300"
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
            className="md:hidden text-2xl p-2 rounded focus:outline-none hover:scale-110 transition-transform duration-300"
            aria-label={isMobileMenuOpen ? "Close Mobile Menu" : "Open Mobile Menu"}
          >
            {isMobileMenuOpen ? (
              <HiOutlineX className="w-8 h-8 text-indigo-600" />
            ) : (
              <HiOutlineMenuAlt3 className="w-8 h-8 text-indigo-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />
    </nav>
  );
};

export default Navbar;
