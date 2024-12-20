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
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
      } min-h-screen py-12 px-6 md:px-12`}
    >
      <h1 className="text-5xl font-extrabold mb-12 text-center">Your Cart</h1>
      {items.length === 0 ? (
        <p className="text-xl font-medium text-center">Your cart is currently empty. Start shopping now!</p>
      ) : (
        <div className="space-y-8 max-w-5xl mx-auto">
          {items.map((item) => (
            <div
              key={item._id}
              className={`${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } flex flex-col md:flex-row items-center justify-between p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105`}
            >
              <div className="flex items-center space-x-8">
                <img
                  src={item.product.imageUrls[0] || '/placeholder.png'}
                  alt={item.product.name}
                  className="w-28 h-28 object-cover rounded-lg shadow-md"
                />
                <div className="flex flex-col space-y-3">
                  <h3 className="text-2xl font-semibold">{item.product.name}</h3>
                  <p className="text-md text-gray-400">Size: <span className="font-medium text-gray-600">{item.size}</span></p>
                  <p className="text-md text-gray-400">Quantity: <span className="font-medium text-gray-600">{item.quantity}</span></p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-4 mt-6 md:mt-0">
                <p className="text-2xl font-bold text-indigo-600">
                  ${item.product.price * item.quantity}
                </p>
                <button
                  onClick={() => handleRemove(item.product._id, item.size)}
                  className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div
            className={`${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            } p-8 rounded-lg shadow-lg`}
          >
            <h2 className="text-3xl font-bold text-right">
              Total: $
              {items.reduce(
                (acc, item) => acc + item.product.price * item.quantity,
                0
              ).toFixed(2)}
            </h2>
            <button
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg mt-6 transition-transform transform hover:scale-105 float-right"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
