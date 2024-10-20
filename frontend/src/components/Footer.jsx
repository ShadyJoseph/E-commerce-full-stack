import React from 'react';
import Logo from '../assets/logo.avif'; 
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa'; 
import { BsFillHeartFill } from 'react-icons/bs';

const Footer = () => {
  return (
    <footer className="bg-green-700 text-white py-10 mt-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        
        {/* Logo Section */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <img src={Logo} alt="App Logo" className="h-12 w-auto" />
          <span className="text-2xl font-bold tracking-wide text-white">
            Good Grabs
          </span>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-5 mt-6 md:mt-0">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="transition-transform duration-300 transform hover:scale-110 hover:shadow-lg"
          >
            <FaFacebookF className="bg-green-800 p-2 rounded-full h-8 w-8 text-white hover:bg-yellow-500 transition duration-300" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="transition-transform duration-300 transform hover:scale-110 hover:shadow-lg"
          >
            <FaTwitter className="bg-green-800 p-2 rounded-full h-8 w-8 text-white hover:bg-yellow-500 transition duration-300" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="transition-transform duration-300 transform hover:scale-110 hover:shadow-lg"
          >
            <FaLinkedinIn className="bg-green-800 p-2 rounded-full h-8 w-8 text-white hover:bg-yellow-500 transition duration-300" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="transition-transform duration-300 transform hover:scale-110 hover:shadow-lg"
          >
            <FaInstagram className="bg-green-800 p-2 rounded-full h-8 w-8 text-white hover:bg-yellow-500 transition duration-300" />
          </a>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="flex justify-center flex-col items-center mt-6">
        <p className="text-sm md:text-base text-gray-10 mb-4 text-center">
          &copy; {new Date().getFullYear()} Good Grabs . All Rights Reserved. 
          <span className="text-red-500">
            <BsFillHeartFill className="inline-block h-4 w-4 mx-1" />
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
