// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import { CartProvider } from './context/CartContext'; // Import CartProvider
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Footer from './components/Footer';  
import Header from './components/Header';
import ProfilePage from './pages/Profile';
import RestaurantsPage from './pages/restaurants';
import AboutUsPage from './pages/AboutUs';
import Cart from './pages/Cart';
import RestaurantDetail from './pages/RestaurantDetail';
import CheckOutDetails from './pages/Checkout';
const App = () => {
  return (
    <AuthProvider> {/* Wrap with AuthProvider */}
      <CartProvider> {/* Wrap with CartProvider */}
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow mt-10">
              {/* Routes setup */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/restaurants" element={<RestaurantsPage />} />
                <Route path="/restaurants/:id" element={<RestaurantDetail />} />
                <Route path="/aboutus" element={<AboutUsPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<CheckOutDetails />} />
              </Routes>
            </div>

            {/* Footer placed outside of the routing */}
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
