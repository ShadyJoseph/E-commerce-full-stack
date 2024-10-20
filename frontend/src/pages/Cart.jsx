import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const {
    state: { cart },
    removeFromCart,
  } = useCart();

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
  };

  return (
    <div className="bg-gray-100 min-h-screen mt-16 p-6 text-gray-900">
      <div className="container mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-4xl font-bold mb-6 text-center">My Cart</h2>
        {cart.length > 0 ? (
          <div className="flex flex-col space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-green-100 rounded-lg p-4 shadow-md">
                <div className="flex items-center">
                  <img
                    src="https://via.placeholder.com/100" // Placeholder image
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="ml-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-700">Your cart is empty.</p>
        )}

        {cart.length > 0 && (
          <div className="border-t border-gray-200 mt-6 pt-4">
            <div className="flex justify-between text-lg font-medium">
              <p>Subtotal</p>
              <p>${cart.reduce((total, item) => total + item.price, 0).toFixed(2)}</p>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="mt-4">
              <Link
                to="/checkout"
                className="block w-full bg-green-600 text-white text-center py-3 rounded-md font-semibold hover:bg-green-700 transition duration-300"
              >
                Checkout
              </Link>
            </div>
            <div className="mt-2 text-center text-sm">
              <p>
                or
                <Link
                  to="/"
                  className="font-medium text-green-600 hover:text-green-500 ml-1"
                >
                  Continue Shopping
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
