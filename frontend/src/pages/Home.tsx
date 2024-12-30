import React, { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { fetchCategories } from "../stores/slices/productSlice";
import {  useNavigate } from "react-router-dom";
import HeroBanner from "../components/HeroBanner"; // Import the HeroBanner component

const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const { categories, loading, error } = useAppSelector((state) => state.products); // Access state from the product slice
  const darkMode = useAppSelector(
    (state: { theme: { darkMode: boolean } }) => state.theme.darkMode
  );

  // Fetch categories using Redux
  useEffect(() => {
    if (categories.length === 0 && !loading) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories, loading]);

  // Render category cards dynamically
  const categoryCards = useMemo(
    () =>
      categories.map((category, index) => (
        <div
          key={index}
          className={`${
            darkMode
              ? "bg-gray-800 text-white"
              : "bg-gradient-to-br from-gray-100 to-gray-200"
          } rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2 hover:scale-105`}
        >
          <div
            className={`${
              darkMode
                ? "bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600"
                : "bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500"
            } h-56 flex items-center justify-center rounded-t-lg`}
          >
            <span
              className="text-3xl font-extrabold text-white uppercase tracking-wider"
              aria-label={`Category: ${category}`}
            >
              {category}
            </span>
          </div>
          <div className="p-8 text-center">
            <button
              onClick={() => navigate(`/products?category=${category}`)} // Use navigate to redirect
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition transform hover:scale-105"
              aria-label={`Explore ${category}`}
            >
              Explore
            </button>
          </div>
        </div>
      )),
    [categories, darkMode, navigate] // Add navigate to dependencies
  );

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } min-h-screen`}
    >
      {/* Hero Banner Section */}
      <HeroBanner />

      {/* Categories Section */}
      <div className="py-16 px-4">
        <h2 className="text-4xl font-extrabold text-center mb-12">
          Shop by Category
        </h2>
        {loading ? (
          <div className="text-center text-lg font-medium text-gray-500">
            Loading categories...
          </div>
        ) : error ? (
          <div className="text-center text-lg text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryCards}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
