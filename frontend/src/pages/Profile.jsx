import React from 'react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  // Sample data for the user's profile
  const user = {
    firstName: "John",
    lastName: "Doe",
    address: "123 Food Lane, Flavor Town, FT 12345",
    favoriteRestaurants: [
      { name: "Pasta Palace", cuisine: "Italian" },
      { name: "Sushi Spot", cuisine: "Japanese" },
      { name: "Taco Haven", cuisine: "Mexican" },
    ],
  };

  return (
    <div className="bg-gray-100 min-h-screen mt-16 p-6">
      <div className="container mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-6 text-center">Profile</h1>

        {/* User Information */}
        <div className="mb-8 p-4 border-l-4 border-green-600 bg-green-50 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Personal Information</h2>
          <p className="text-lg text-gray-700">Name: <span className="font-bold">{user.firstName} {user.lastName}</span></p>
          <p className="text-lg text-gray-700">Address: <span className="font-bold">{user.address}</span></p>
        </div>

        {/* Favorite Restaurants */}
        <div className="mb-8 p-4 border-l-4 border-green-600 bg-green-50 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Favorite Restaurants</h2>
          {user.favoriteRestaurants.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
              {user.favoriteRestaurants.map((restaurant, index) => (
                <li key={index} className="text-lg text-gray-700">
                  {restaurant.name} - <span className="italic">{restaurant.cuisine}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">You have no favorite restaurants yet.</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link to="/restaurants" className="bg-gray-300 text-gray-800 py-2 px-6 rounded-full shadow-lg hover:bg-gray-400 transition duration-300">
            Explore Restaurants
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
