import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RootState } from '../stores/store';
import { fetchCategories, } from '../stores/slices/productSlice'; // Import the product slice to fetch categories
import { useAppSelector,useAppDispatch } from '../hooks/reduxHooks';
interface CategoriesMenuProps {
  onClick?: () => void;
  isMobile?: boolean;
}

const CategoriesMenu: React.FC<CategoriesMenuProps> = ({ onClick, isMobile = false }) => {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state: RootState) => state.theme.darkMode); // Access the theme state from Redux
  const { categories, loading, error } = useAppSelector((state) => state.products); // Access product state from Redux

  // Fetch categories using Redux
  useEffect(() => {
    if (categories.length === 0 && !loading) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories, loading]);

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
