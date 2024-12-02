import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchProductById } from '../stores/slices/productSlice';
import Loader from '../components/Loader';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentProduct, loading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (loading) return <Loader />; // Use a loader component for better UX
  if (error) return <p className="text-red-500 text-center text-xl mt-8">{error}</p>; // Styled error message
  if (!currentProduct) return <p className="text-lg text-center text-gray-700 mt-8">Product not found.</p>; // Product not found message

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-indigo-600 mb-4">{currentProduct.name}</h1>
        <p className="text-gray-500 mt-4">{currentProduct.description}</p>
        <p className="text-lg font-medium mt-2 text-indigo-600">${currentProduct.price}</p>
      </div>

      {/* Product Image */}
      <div className="mt-8 flex justify-center">
        <img
          src={currentProduct.imageUrls[0] || '/placeholder-image.jpg'} // Fallback image
          alt={currentProduct.name}
          className="w-full max-w-3xl h-auto rounded-lg shadow-lg object-cover"
        />
      </div>

      {/* Add to Cart and Buy Buttons */}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
          aria-label="Add to cart"
        >
          Add to Cart
        </button>
        <button
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
          aria-label="Buy Now"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
