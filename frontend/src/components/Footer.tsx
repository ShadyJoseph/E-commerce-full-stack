import React from "react";
import { IoMail, IoLocationSharp } from "react-icons/io5";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import { useThemeStore } from "../stores/themeStore";

const Footer: React.FC = () => {
  const { darkMode } = useThemeStore();

  return (
    <footer
      className={` py-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          {/* Contact Section */}
          <div className="flex flex-col items-center space-y-4">
            <p className="text-lg font-bold">Contact Us</p>
            <div className="flex items-center space-x-3">
              <IoMail className="text-2xl" />
              <span className="text-sm">shadyjosephabadeer2003@gmail.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <IoLocationSharp className="text-2xl" />
              <span className="text-sm">Egypt, Cairo</span>
            </div>
          </div>

          {/* Get in Touch Section */}
          <div className="flex flex-col items-center space-y-4">
            <p className="text-lg font-bold">Get In Touch</p>
            <p
              className={`cursor-pointer ${
                darkMode ? "hover:text-gray-400" : "hover:text-gray-700"
              } transition`}
            >
              About Us
            </p>
            <p
              className={`cursor-pointer ${
                darkMode ? "hover:text-gray-400" : "hover:text-gray-700"
              } transition`}
            >
              Privacy Policy
            </p>
            <p
              className={`cursor-pointer ${
                darkMode ? "hover:text-gray-400" : "hover:text-gray-700"
              } transition`}
            >
              Terms and Conditions
            </p>
          </div>

          {/* Social Media Section */}
          <div className="flex flex-col items-center space-y-6">
            <p className="text-lg font-bold">Follow Us</p>
            <div className="flex space-x-6">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-full p-3 ${
                  darkMode ? "bg-gray-800" : "bg-gray-200"
                } hover:bg-pink-500 hover:text-white transition duration-300`}
              >
                <FaInstagram className="text-2xl" />
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-full p-3 ${
                  darkMode ? "bg-gray-800" : "bg-gray-200"
                } hover:bg-blue-500 hover:text-white transition duration-300`}
              >
                <FaFacebook className="text-2xl" />
              </a>
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-full p-3 ${
                  darkMode ? "bg-gray-800" : "bg-gray-200"
                } hover:bg-black hover:text-white transition duration-300`}
              >
                <FaTiktok className="text-2xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center mt-8 opacity-80">
          <p className="text-sm">
            &copy; 2024 Your Company, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
