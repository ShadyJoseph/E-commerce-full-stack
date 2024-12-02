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
    <div className={`cart-page ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} min-h-screen py-12 px-6 md:px-12`}>
      <h1 className="text-3xl font-semibold mb-8 text-center">Your Cart</h1>
      {items.length === 0 ? (
        <p className="text-lg text-center">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item._id} className="flex items-center justify-between p-6 rounded-lg border shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-6">
                <img
                  src={item.product.imageUrls[0]}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg shadow-md"
                />
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-medium">{item.product.name}</h3>
                  <p className="text-sm text-gray-400">Size: {item.size}</p>
                  <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <p className="text-lg font-semibold text-gray-800">${item.product.price}</p>
                <button
                  onClick={() => handleRemove(item.product._id, item.size)}
                  className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-300 w-full"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
