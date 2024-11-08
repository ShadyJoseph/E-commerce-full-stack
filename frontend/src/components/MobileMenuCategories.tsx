// CategoriesMenu.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface CategoriesMenuProps {
  onClick?: () => void;  // Optional callback to close the menu on link click
  isMobile?: boolean;  // Toggle styling for mobile or desktop usage
}

const CategoriesMenu: React.FC<CategoriesMenuProps> = ({ onClick, isMobile = false }) => {
  const categories = ['Home', 'Men', 'Women', 'Kids'];

  return (
    <div className={isMobile ? 'flex flex-col items-center space-y-8 mt-6' : 'flex space-x-4'}>
      {categories.map((category) => (
        <Link
          key={category}
          to={`/${category.toLowerCase()}`}
          onClick={onClick}
          className={`text-lg font-semibold tracking-wider transition-all duration-200 ease-in-out ${
            isMobile ? 'hover:underline hover:text-primaryColor text-white' : 'hover:text-primaryColor'
          }`}
          aria-label={category}
        >
          {category}
        </Link>
      ))}
    </div>
  );
};

export default CategoriesMenu;
