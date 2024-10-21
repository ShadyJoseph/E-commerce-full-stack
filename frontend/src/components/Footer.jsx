import React from 'react';
import Logo from '../assets/logo.avif'; 
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa'; 
import { BsFillHeartFill } from 'react-icons/bs';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-700 to-green-900 text-white py-12 mt-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">

        {/* Logo Section */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <img src={Logo} alt="App Logo" className="h-14 w-auto filter brightness-110" />
          <span className="text-3xl font-extrabold tracking-wider text-white">
            Good Grabs
          </span>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 mt-6 md:mt-0">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="transition-transform duration-300 transform hover:scale-110 hover:shadow-2xl"
          >
            <FaFacebookF className="bg-green-800 p-2 rounded-full h-9 w-9 text-white hover:bg-yellow-500 transition duration-300" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="transition-transform duration-300 transform hover:scale-110 hover:shadow-2xl"
          >
            <FaTwitter className="bg-green-800 p-2 rounded-full h-9 w-9 text-white hover:bg-yellow-500 transition duration-300" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="transition-transform duration-300 transform hover:scale-110 hover:shadow-2xl"
          >
            <FaLinkedinIn className="bg-green-800 p-2 rounded-full h-9 w-9 text-white hover:bg-yellow-500 transition duration-300" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="transition-transform duration-300 transform hover:scale-110 hover:shadow-2xl"
          >
            <FaInstagram className="bg-green-800 p-2 rounded-full h-9 w-9 text-white hover:bg-yellow-500 transition duration-300" />
          </a>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="flex justify-center flex-col items-center mt-8">
        <p className="text-sm md:text-base text-gray-200 mb-4 text-center">
          &copy; {new Date().getFullYear()} Good Grabs. All Rights Reserved.
          <span className="text-red-500">
            <BsFillHeartFill className="inline-block h-5 w-5 mx-2" />
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
