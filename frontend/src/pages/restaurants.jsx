
import React from 'react';
import { Link } from 'react-router-dom';
import pasta from '../assets/pasta.jpg';
import sushi from '../assets/sushi1.jpg';
import tacos from '../assets/tacos.jpg';

const RestaurantsPage = () => {
  // Sample data for restaurants
  const restaurants = [
    {
      id: 1,
      name: "Pasta Palace",
      address: "456 Noodle Ave, Flavor Town, FT 12345",
      items: ["Spaghetti Carbonara", "Fettuccine Alfredo", "Penne Arrabbiata"],
      rating: 4.5,
      image: pasta, 
    },
    {
      id: 2,
      name: "Sushi Spot",
      address: "789 Sushi St, Flavor Town, FT 12345",
      items: ["California Roll", "Spicy Tuna Roll", "Salmon Sashimi"],
      rating: 4.8,
      image: sushi,
    },
    {
      id: 3,
      name: "Taco Haven",
      address: "321 Taco Rd, Flavor Town, FT 12345",
      items: ["Taco Al Pastor", "Baja Fish Taco", "Vegetarian Taco"],
      rating: 4.6,
      image: tacos,
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen mt-16 p-6">
      <div className="container mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Available Restaurants Nearby</h1>

        {/* Restaurant Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-green-50 rounded-lg shadow-md p-4 transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              {/* Image */}
              <img
                src={restaurant.image}
                alt={`${restaurant.name} cover`}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              {/* Restaurant Details */}
              <h2 className="text-2xl font-semibold mb-2 text-green-800">{restaurant.name}</h2>
              <p className="text-gray-600 mb-2">
                <span className="font-medium text-gray-700">Address:</span> {restaurant.address}
              </p>

              {/* Rating */}
              <div className="text-yellow-500 font-semibold flex items-center mb-2">
                Rating: {restaurant.rating} ★
                <span className="ml-2 text-sm text-gray-500">({restaurant.items.length} items)</span>
              </div>

              {/* Available Items */}
              <h3 className="font-semibold text-green-700 mb-2">Available Items:</h3>
              <ul className="list-disc pl-5 text-gray-700 mb-4">
                {restaurant.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              {/* Link to Restaurant Details */}
              <Link
                to={`/restaurants/${restaurant.id}`}
                className="block bg-green-600 text-white text-center py-2 px-4 rounded-full shadow-lg hover:bg-green-700 transition duration-300"
              >
                View More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantsPage;
