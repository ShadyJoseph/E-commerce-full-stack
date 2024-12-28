import React, { useState, useRef, useEffect } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { fetchCategories } from "../stores/slices/productSlice";

interface CategoriesProps {
  onCategorySelect?: (category: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ onCategorySelect }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const darkMode = useAppSelector((state) => state.theme.darkMode);

  const { categories, loading, error } = useAppSelector((state) => state.products);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  useEffect(() => {
    if (categories.length === 0 && !loading) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories, loading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCategoryClick = (category: string) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
    navigate(`/products?category=${category}`);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`text-lg font-semibold px-4 py-2 rounded-lg shadow-sm flex items-center space-x-2 transition-all duration-300 ${
          darkMode
            ? "text-gray-200 bg-gray-800 hover:bg-gray-700 hover:text-white"
            : "text-gray-800 bg-gray-100 hover:bg-gray-200 hover:text-gray-900"
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
          className={`absolute left-0 mt-2 w-56 rounded-md shadow-lg border z-10 transition-opacity duration-300 ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-gray-100"
              : "bg-white border-gray-200 text-gray-800"
          }`}
        >
          {loading ? (
            <div className="px-4 py-2 text-gray-500 animate-pulse">Loading...</div>
          ) : error ? (
            <div className="px-4 py-2 text-red-500">{error}</div>
          ) : (
            categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`w-full text-left px-4 py-2 text-lg font-medium transition-colors duration-300 rounded-lg ${
                  darkMode
                    ? "hover:bg-gray-700 hover:text-gray-50"
                    : "hover:bg-gray-100 hover:text-gray-900"
                }`}
                aria-label={category}
              >
                {category}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Categories;
