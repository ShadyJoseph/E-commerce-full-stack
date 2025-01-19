import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../stores/store';
import { fetchCart, removeFromCart } from '../stores/slices/cartSlice';
import Loader from '../components/Loader';
import { useAppDispatch } from '../hooks/reduxHooks';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, isLoading, error } = useSelector((state: RootState) => state.cart);
  const { darkMode } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemove = (productId: string, size: string) => {
    dispatch(removeFromCart({ productId, size }))
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500 text-center">Error: {error}</p>;

  return (
    <div
      className={`${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      } min-h-screen py-12 px-6 md:px-12 transition-all`}
    >
      <h1 className="text-4xl font-extrabold mb-12 text-center">
        Your Cart
      </h1>
      {items.length === 0 ? (
        <p className="text-xl font-medium text-center">
          Your cart is currently empty. Start shopping now!
        </p>
      ) : (
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item._id}
                className={`${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } flex flex-col md:flex-row items-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow`}
              >
                <img
                  src={item.product.imageUrls?.[0] || '/placeholder.png'}
                  alt={item.product.name}
                  className="w-32 h-32 object-cover rounded-lg shadow-md md:w-40 md:h-40"
                />
                <div className="flex-grow px-6">
                  <h3 className="text-lg font-semibold mb-2">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    <span className="font-medium">Size:</span> {item.size}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Quantity:</span> {item.quantity}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    ${item.product.price * item.quantity}
                  </p>
                  <button
                    onClick={() => handleRemove(item.product._id, item.size)}
                    className="text-sm bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-transform hover:scale-105"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            } p-6 rounded-lg shadow-lg space-y-6`}
          >
            <h2 className="text-2xl font-semibold text-right">
              Total: $
              {items
                .reduce((acc, item) => acc + item.product.price * item.quantity, 0)
                .toFixed(2)}
            </h2>
            <div className="flex justify-between space-x-4">
              <button
                onClick={() => navigate('/products')}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-md transition-transform hover:scale-105"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/checkout')}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-md transition-transform hover:scale-105"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
