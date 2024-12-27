import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../stores/slices/productSlice';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import Loader from '../components/Loader';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentProduct, loading, error } = useAppSelector((state) => state.products);
  const darkMode = useAppSelector((state) => state.theme.darkMode);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    } else {
      console.error('Product ID is undefined. Please check the navigation or route definition.');
    }
  }, [dispatch, id]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center text-xl mt-8">{error}</p>;
  if (!currentProduct) return <p className="text-lg text-center mt-8">Product not found.</p>;

  return (
    <div
      className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen py-12`}
    >
      <div className="container mx-auto px-4">
        {/* Product Name and Description */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
            {currentProduct.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-4">{currentProduct.description}</p>
          <p className="text-lg font-medium mt-2 text-indigo-600 dark:text-indigo-400">
            ${currentProduct.price}
          </p>
        </div>

        {/* Product Image */}
        <div className="mt-8 flex justify-center">
          <img
            src={currentProduct.imageUrls[0] || '/placeholder-image.jpg'}
            alt={currentProduct.name}
            className="w-full max-w-3xl h-auto rounded-lg shadow-lg object-cover"
            aria-label={`Image of ${currentProduct.name}`}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add to cart"
          >
            Add to Cart
          </button>
          <button
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Buy Now"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
