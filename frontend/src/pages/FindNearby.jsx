import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { FaMapMarkerAlt } from 'react-icons/fa';

const FindNearbyRestaurants = () => {
  const [loading, setLoading] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  const navigate = useNavigate();

  const handleFindRestaurants = () => {
    setLoading(true);
    setLocationDetected(false);

    // Simulate getting user's location
    setTimeout(() => {
      const userLocation = { latitude: 37.7749, longitude: -122.4194 }; // Simulated location (San Francisco)

      // Simulate fetching nearby restaurants based on location
      setTimeout(() => {
        console.log("User's Location:", userLocation);
        console.log("Fetching nearby restaurants...");
        setLocationDetected(true);

        // Simulate a delay before navigating
        setTimeout(() => {
          navigate('/restaurants'); // Navigate to the restaurants page
        }, 500); // Delay before navigation
      }, 1000); // Simulated fetch delay
    }, 1000); // Simulated location retrieval delay
  };

  return (
    <div className=" flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-lg p-8 lg:p-16 w-full max-w-3xl mx-auto transition-all duration-300">
        <h2 className="text-3xl font-bold mb-6 flex items-center justify-center text-gray-900">
          <FaMapMarkerAlt className="text-green-600 mr-3" />
          Find Nearby Restaurants
        </h2>

        {loading ? (
          <div className="flex flex-col items-center">
            <Loader height="80" width="80" color="green" />
            <p className="text-lg mt-4 text-gray-600 animate-fade-in">
              Detecting your location...
            </p>
          </div>
        ) : locationDetected ? (
          <div className="flex flex-col items-center">
            <p className="text-lg mt-4 text-green-600 animate-fade-in">
              Location detected! Redirecting to nearby restaurants...
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={handleFindRestaurants}
              className="bg-gradient-to-r from-green-500 to-green-700 text-white py-3 px-10 rounded-full shadow-md hover:from-green-600 hover:to-green-800 hover:shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center"
            >
              <FaMapMarkerAlt className="mr-2" />
              Find Nearby Restaurants
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindNearbyRestaurants;
