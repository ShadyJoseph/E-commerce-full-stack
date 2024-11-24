import React, { useEffect } from "react";
import useProductStore from "../stores/productStore"; // Zustand store for products
import { useThemeStore } from "../stores/themeStore"; // Zustand store for theme

const HomeScreen: React.FC = () => {
  const { categories, fetchCategories, loading, error } = useProductStore();
  const { darkMode, toggleDarkMode } = useThemeStore(); // Access darkMode from the store

  useEffect(() => {
    fetchCategories(); // Fetch categories when the component mounts
  }, [fetchCategories]);

  // Apply classes conditionally based on the darkMode state
  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen`}>
      {/* Banner Section */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-700' : 'bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500'} text-white py-28 text-center`}>
        <h1 className="text-5xl font-extrabold mb-6">
          Welcome to <span className="underline decoration-wavy decoration-yellow-300">YourShop</span>
        </h1>
        <p className="text-lg font-medium max-w-2xl mx-auto mb-6">
          Discover top-quality products and amazing deals tailored just for you.
        </p>
        <button className="mt-6 px-8 py-4 bg-yellow-400 text-gray-900 rounded-full font-semibold hover:bg-yellow-300 transition duration-300 transform hover:scale-105">
          Shop Now
        </button>
      </div>

      {/* Categories Section */}
      <div className="py-16">
        <h2 className="text-4xl font-extrabold text-center mb-12">
          Shop by Category
        </h2>
        {loading ? (
          <div className="text-center text-lg font-medium text-gray-500">Loading categories...</div>
        ) : error ? (
          <div className="text-center text-red-500 font-semibold">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {categories.map((category, index) => (
              <div
                key={index}
                className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-gradient-to-br from-gray-100 to-gray-200'} rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2 hover:scale-105`}
              >
                <div className={`${darkMode ? 'bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600' : 'bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500'} h-56 flex items-center justify-center`}>
                  <span className="text-3xl font-extrabold text-white uppercase tracking-wider">
                    {category}
                  </span>
                </div>
                <div className="p-8 text-center">
                  <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition transform hover:scale-105">
                    Explore
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
