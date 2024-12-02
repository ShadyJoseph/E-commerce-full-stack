import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllProducts } from '../stores/slices/productSlice';
import { Product } from '../stores/slices/productSlice';
import Loader from '../components/Loader';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useAppSelector((state) => state.products);
  const darkMode = useAppSelector((state) => state.theme.darkMode);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    sort: '-createdAt',
    category: '',
    gender: undefined as 'men' | 'women' | 'unisex' | undefined,
  });

  useEffect(() => {
    dispatch(fetchAllProducts({ ...pagination }));
  }, [dispatch, pagination]);

  const handlePageChange = (newPage: number) => {
    setPagination((prevState) => ({ ...prevState, page: newPage }));
  };

  const handleViewDetails = (id: string) => {
    navigate(`/products/${id}`);
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen`}>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16 px-8 text-center shadow-lg">
        <h1 className="text-5xl font-bold animate-fade-in-down">Welcome to Our Store</h1>
        <p className="text-lg mt-4 animate-fade-in-up">Discover products tailored just for you.</p>
      </div>

      <div className="container mx-auto py-12 px-4">
        {/* Products Section */}
        {products.length === 0 ? (
          <p className="text-lg text-center">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: Product) => (
              <div
                key={product.id}
                className={`${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-2 transition`}
              >
                <img
                  src={product.imageUrls[0]}
                  alt={product.name}
                  className="w-full h-56 object-cover hover:scale-105 transition-transform"
                />
                <div className="p-4 text-center">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <p className="text-lg font-medium mt-2">${product.price}</p>
                  <div className="mt-4">
                    <button
                      onClick={() => handleViewDetails(product.id)}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition transform hover:scale-105"
                      aria-label={`View details for ${product.name}`}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-4 mt-8">
        <button
          disabled={pagination.page <= 1}
          onClick={() => handlePageChange(pagination.page - 1)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition"
        >
          Previous
        </button>
        <span className="text-lg">Page {pagination.page}</span>
        <button
          disabled={products.length < pagination.limit}
          onClick={() => handlePageChange(pagination.page + 1)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;
