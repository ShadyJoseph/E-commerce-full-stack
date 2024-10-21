
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import FindNearbyRestaurants from './FindNearby';

const HomePage = () => {
  const { state } = useAuth();

  return (
    <div className="bg-gray-50 min-h-screen mt-13">
      {/* Hero Section */}
      <header className="relative bg-green-600 text-white py-16 md:py-24 lg:py-32">
        <div className="absolute inset-0 bg-cover bg-center opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-green-700 via-green-600 to-green-500 opacity-80" />
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-wide">
            Transform Lives, One Meal at a Time
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto font-light">
            Join us in the mission to fight food waste. Enjoy delicious meals from local restaurants at discounted prices while making a positive impact.
          </p>
          {state.isAuthenticated && (
            <FindNearbyRestaurants />
          )}
        </div>
      </header>

      {/* Purpose Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto text-center px-6 lg:px-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Purpose</h2>
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            We believe no food should go to waste while people go hungry. Our platform connects you with local eateries, allowing you to purchase delicious, unsold meals at a fraction of the cost. Together, we can create a sustainable future.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-green-100 to-green-200 py-12 md:py-16">
        <div className="container mx-auto text-center px-6 lg:px-0">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Be Part of the Change</h2>
          <p className="text-gray-700 text-lg md:text-xl mb-6 max-w-2xl mx-auto">
            Sign up today and take the first step towards reducing food waste. Every meal you purchase not only helps the environment but also supports your local community.
          </p>
          {!state.isAuthenticated && (
            <Link
              to="/signup"
              className="inline-block bg-green-600 text-white py-3 px-10 rounded-full shadow-lg hover:bg-green-700 hover:shadow-xl transition duration-300 ease-in-out text-lg md:text-xl font-semibold"
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