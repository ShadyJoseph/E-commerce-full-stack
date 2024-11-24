import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../stores/themeStore';
import useProductStore from '../stores/productStore'; // Import product store to fetch categories

interface CategoriesMenuProps {
  onClick?: () => void;
  isMobile?: boolean;
}

const CategoriesMenu: React.FC<CategoriesMenuProps> = ({ onClick, isMobile = false }) => {
  const { darkMode } = useThemeStore(); // Access the theme state
  const { categories, fetchCategories, loading, error } = useProductStore(); // Fetch categories from the store

  useEffect(() => {
    fetchCategories(); // Fetch categories when the component mounts
  }, [fetchCategories]);

  return (
    <div className={isMobile ? 'flex flex-col items-center space-y-8 mt-6' : 'flex space-x-4'}>
      {loading ? (
        <div className="text-lg font-semibold text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-lg font-semibold text-red-500">{error}</div>
      ) : (
        categories.map((category) => (
          <Link
            key={category}
            to={`/${category.toLowerCase()}`}
            onClick={onClick}
            className={`text-lg font-semibold tracking-wider transition-all duration-200 ease-in-out ${
              isMobile
                ? `${darkMode ? 'text-gray-200 hover:text-primaryColor' : 'text-gray-900 hover:text-primaryColor'}`
                : `${darkMode ? 'text-white hover:text-primaryColor' : 'text-gray-900 hover:text-primaryColor'}`
            }`}
            aria-label={category}
          >
            {category}
          </Link>
        ))
      )}
    </div>
  );
};

export default CategoriesMenu;
