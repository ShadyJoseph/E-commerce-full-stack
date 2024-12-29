import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../stores/slices/productSlice';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import Loader from '../components/Loader';
import { FaShoppingCart } from 'react-icons/fa';
import { addToCart } from '../stores/slices/cartSlice';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>(); 
  const dispatch = useAppDispatch();
  const { currentProduct, loading, error } = useAppSelector((state) => state.products);
  const darkMode = useAppSelector((state) => state.theme.darkMode);

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      // Ensure the id is treated as a string before dispatching
      dispatch(fetchProductById(String(id)));  // Stringify the id
    } else {
      console.error('Product ID is undefined. Please check the navigation or route definition.');
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!currentProduct || !selectedColor || !selectedSize || quantity <= 0) {
      console.error('Please select a product, color, size, and valid quantity.');
      return;
    }

    dispatch(
      addToCart({
        productId: String(currentProduct._id),  // Stringify the productId
        size: selectedSize,
        quantity,
        color: selectedColor,
      })
    )
      .unwrap()
      .then(() => {
        console.log('Item added to cart successfully!');
      })
      .catch((error: any) => {
        console.error('Error adding item to cart:', error);
      });
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) setQuantity(newQuantity);
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center text-xl mt-8">{error}</p>;
  if (!currentProduct) return <p className="text-lg text-center mt-8">Product not found.</p>;

  return (
    <div
      className={`
        ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-white text-gray-900'}
        min-h-screen py-12 transition-colors duration-300
      `}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <div className="flex justify-center">
            <img
              src={currentProduct.imageUrls[0] || '/placeholder-image.jpg'}
              alt={currentProduct.name}
              className="w-full max-w-lg h-auto rounded-lg shadow-lg object-cover transition-transform duration-300 hover:scale-105"
              aria-label={`Image of ${currentProduct.name}`}
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-extrabold text-indigo-500 dark:text-indigo-300 mb-4">
              {currentProduct.name}
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              {currentProduct.description}
            </p>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              ${currentProduct.price.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentProduct.discount}% off
              {currentProduct.rating && ` • Rated ${currentProduct.rating} ★`}
            </p>

            {/* Product Colors */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Available Colors</h2>
              <div className="flex space-x-4">
                {currentProduct.colors.map((color) => (
                  <div
                    key={color.color}
                    className={`
                      w-10 h-10 rounded-full border-4 cursor-pointer transition-all duration-300
                      ${
                        selectedColor === color.color
                          ? 'border-indigo-500 scale-110 shadow-lg'
                          : 'border-gray-300 dark:border-gray-600'
                      }
                    `}
                    style={{ backgroundColor: color.color }}
                    onClick={() => setSelectedColor(color.color)}
                    aria-label={`Color option: ${color.color}`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Available Sizes */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Available Sizes</h2>
              <div className="flex flex-wrap gap-4">
                {currentProduct.colors
                  .find((color) => color.color === selectedColor)
                  ?.availableSizes.map((size) => (
                    <button
                      key={size.size}
                      className={`
                        px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-300
                        ${
                          selectedSize === size.size
                            ? 'bg-indigo-500 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900'
                        }
                      `}
                      onClick={() => setSelectedSize(size.size)}
                      disabled={size.stock === 0}
                      aria-label={`Size option: ${size.size}, Stock: ${size.stock}`}
                    >
                      {size.size} ({size.stock} in stock)
                    </button>
                  ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Quantity</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-4 py-2 border rounded-lg text-lg font-bold bg-gray-300 dark:bg-gray-800 hover:bg-indigo-300 dark:hover:bg-indigo-700 transition-all duration-300 shadow-lg"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="text-2xl font-semibold text-indigo-600 dark:text-indigo-300">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-4 py-2 border rounded-lg text-lg font-bold bg-gray-300 dark:bg-gray-800 hover:bg-indigo-300 dark:hover:bg-indigo-700 transition-all duration-300 shadow-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={!selectedColor || !selectedSize || quantity <= 0}
                className="
                  flex items-center justify-center px-8 py-3 rounded-lg shadow-lg
                  bg-indigo-600 text-white font-semibold transition-all duration-300
                  hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed
                "
                aria-label="Add to cart"
              >
                <FaShoppingCart className="mr-2" /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
