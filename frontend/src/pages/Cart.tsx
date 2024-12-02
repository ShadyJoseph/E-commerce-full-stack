import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../stores/store';
import { fetchCart, removeFromCart } from '../stores/slices/cartSlice';
import Loader from '../components/Loader';
import { useAppDispatch } from '../hooks/reduxHooks';

const Cart = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useSelector((state: RootState) => state.cart);
  const { darkMode } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemove = (productId: string, size: string) => {
    dispatch(removeFromCart({ productId, size }));
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500 text-center">Error: {error}</p>;

  return (
    <div
      className={`${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      } min-h-screen py-12 px-6 md:px-12`}
    >
      <h1 className="text-4xl font-bold mb-8 text-center">Your Cart</h1>
      {items.length === 0 ? (
        <p className="text-lg text-center">Your cart is empty.</p>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {items.map((item) => (
            <div
              key={item._id}
              className={`${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } flex flex-col md:flex-row items-center justify-between p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-2`}
            >
              <div className="flex items-center space-x-6">
                <img
                  src={item.product.imageUrls[0]}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg shadow-md"
                />
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-gray-400">Size: {item.size}</p>
                  <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-3 mt-4 md:mt-0">
                <p className="text-lg font-bold text-indigo-600">
                  ${item.product.price * item.quantity}
                </p>
                <button
                  onClick={() => handleRemove(item.product._id, item.size)}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } p-6 rounded-lg shadow-md text-right`}
          >
            <h2 className="text-2xl font-semibold">
              Total: $
              {items.reduce(
                (acc, item) => acc + item.product.price * item.quantity,
                0
              )}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
