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
        }, 1500); // Delay before navigation
      }, 2000); // Simulated fetch delay
    }, 2000); // Simulated location retrieval delay
  };

  return (
    <div className="text-center py-12 bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto transition-all duration-300">
      <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
        <FaMapMarkerAlt className="text-green-600 mr-2" />
        Finding Nearby Restaurants...
      </h2>
      
      {loading ? (
        <div className="flex flex-col items-center">
          <Loader height="80" width="80" color="green" />
          <p className="text-lg mt-4 animate-fade-in">Detecting your location...</p>
        </div>
      ) : locationDetected ? (
        <div>
          <p className="text-lg animate-fade-in">Location detected! Redirecting you to nearby restaurants...</p>
        </div>
      ) : (
        <button
          onClick={handleFindRestaurants}
          className="bg-green-600 text-white py-3 px-8 rounded-full shadow-lg hover:bg-green-700 transition duration-300 flex items-center justify-center mx-auto"
        >
          <FaMapMarkerAlt className="mr-2" />
          Find Nearby Restaurants
        </button>
      )}
    </div>
  );
};

export default FindNearbyRestaurants;