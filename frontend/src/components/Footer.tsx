import React from "react";
import { IoMail, IoLocationSharp } from "react-icons/io5";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa"; // Import TikTok from Font Awesome
import { useThemeStore } from '../stores/themeStore';

const Footer: React.FC = () => {
  const { darkMode } = useThemeStore();

  return (
    <footer
      className={`py-10 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-900"}`}
    >
      <div className="container mx-auto px-6 md:px-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">

          {/* Contact Section */}
          <div className="flex flex-col items-center ">
            <p className="text-lg font-semibold mb-4">Contact Us</p>
            <div className="flex items-center justify-center mb-3">
              <IoMail className="me-3 text-xl" />
              <span className={`${darkMode ? "text-gray-300" : "text-gray-900"}`}>shadyjosephabadeer2003@gmail.com</span>
            </div>
            <div className="flex items-center justify-center mb-3">
              <IoLocationSharp className="me-3 text-xl" />
              <span className={`${darkMode ? "text-gray-300" : "text-gray-900"}`}>Egypt, Cairo</span>
            </div>
          </div>

          {/* Get in Touch Section */}
          <div className="flex flex-col items-center">
            <p className="text-lg font-semibold mb-4">Get In Touch</p>
            <div className="mb-2">
              <p className={`${darkMode ? "text-gray-300" : "text-gray-900"} hover:text-gray-500 cursor-pointer`}>
                About Us
              </p>
            </div>
            <div className="mb-2">
              <p className={`${darkMode ? "text-gray-300" : "text-gray-900"} hover:text-gray-500 cursor-pointer`}>
                Privacy Policy
              </p>
            </div>
            <div className="mb-2">
              <p className={`${darkMode ? "text-gray-300" : "text-gray-900"} hover:text-gray-500 cursor-pointer`}>
                Terms and Conditions
              </p>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="flex flex-col items-center">
            <p className="text-lg font-semibold mb-4">Follow Us</p>
            <div className="flex justify-center space-x-4 mb-3">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-${darkMode ? "white" : "gray-900"} hover:text-pink-500 transition duration-300 ease-in-out`}
              >
                <FaInstagram className="text-2xl" />
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-${darkMode ? "white" : "gray-900"} hover:text-blue-500 transition duration-300 ease-in-out`}
              >
                <FaFacebook className="text-2xl" />
              </a>
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-${darkMode ? "white" : "gray-900"} hover:text-black transition duration-300 ease-in-out`}
              >
                <FaTiktok className="text-2xl" /> {/* Correct TikTok icon */}
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center mt-8 opacity-75">
          <p className="text-sm text-gray-600">
            &copy; 2024 Your Company, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
