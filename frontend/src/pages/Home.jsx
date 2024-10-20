

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import FindNearbyRestaurants from './FindNearby';

const HomePage = () => {
  const { state } = useAuth();

  return (
    <div className="bg-gray-100 min-h-screen mt-16">
      {/* Hero Section */}
      <header className="bg-green-600 text-white py-12 relative">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/path-to-your-image.jpg')" }} />
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl font-extrabold mb-4">Transform Lives, One Meal at a Time</h1>
          <p className="text-lg mb-6 max-w-xl mx-auto">
            Join us in the mission to fight food waste. Enjoy delicious meals from local restaurants at discounted prices while making a positive impact.
          </p>
        </div>
      </header>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Our Purpose</h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            We believe no food should go to waste while people go hungry. Our platform connects you with local eateries, allowing you to purchase delicious, unsold meals at a fraction of the cost. Together, we can create a sustainable future.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-50 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Be Part of the Change</h2>
          <p className="text-gray-700 mb-6 max-w-xl mx-auto">
            Sign up today and take the first step towards reducing food waste. Every meal you purchase not only helps the environment but also supports your local community.
          </p>
          {state.isAuthenticated ? (
            <FindNearbyRestaurants /> 
          ) : (
            <Link
              to="/signup"
              className="bg-green-600 text-white py-3 px-8 rounded-full shadow-lg hover:bg-green-700 transition duration-300 text-lg font-semibold"
            >
              Join Us Now
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
