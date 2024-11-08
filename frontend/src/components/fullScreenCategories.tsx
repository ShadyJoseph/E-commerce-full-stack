import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { useThemeStore } from '../stores/themeStore';

const Categories: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { darkMode } = useThemeStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`text-lg font-medium px-4 py-2 rounded-md transition-colors duration-300 flex items-center space-x-2 ${
          darkMode ? 'text-white hover:text-primaryColor' : 'text-gray-800 hover:text-primaryColor'
        }`}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <span>Categories</span>
        {isDropdownOpen ? (
          <HiChevronUp className="w-5 h-5 text-primaryColor" />
        ) : (
          <HiChevronDown className="w-5 h-5 text-primaryColor" />
        )}
      </button>

      {isDropdownOpen && (
        <div
          className={`absolute left-0 mt-2 w-56 rounded-md shadow-lg border ${
            darkMode
              ? 'bg-gray-800 border-gray-700 text-gray-100'
              : 'bg-white border-gray-200 text-gray-800'
          }`}
        >
          {['Men', 'Women', 'Kids'].map((category) => (
            <Link
              key={category}
              to={`/${category.toLowerCase()}`}
              className="block px-4 py-2 text-lg font-semibold hover:bg-gray-200"
              aria-label={category}
            >
              {category}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
