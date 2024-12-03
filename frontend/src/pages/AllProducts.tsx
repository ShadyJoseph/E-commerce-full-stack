import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchAllProducts, Product } from '../stores/slices/productSlice';
import Categories from '../components/fullScreenCategories';
import Loader from '../components/Loader';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { products, loading, error } = useAppSelector((state) => state.products);
  const darkMode = useAppSelector((state) => state.theme.darkMode);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    sort: '-createdAt',
    category: searchParams.get('category') || '',
    gender: undefined as 'men' | 'women' | 'unisex' | undefined,
  });

  useEffect(() => {
    dispatch(fetchAllProducts(pagination));
  }, [dispatch, pagination]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleViewDetails = (id: string) => {
    navigate(`/products/${id}`);
  };

  const handleCategoryChange = (category: string) => {
    setPagination((prev) => ({ ...prev, category, page: 1 }));
    navigate(`/products?category=${category}`);
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen`}>
      {/* Banner Section */}
      <div
        className={`${darkMode
          ? 'bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-700'
          : 'bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500'
          } text-white py-28 text-center shadow-lg`}
      >
        <h1 className="text-5xl font-extrabold mb-6">
          Explore Our <span className="underline decoration-wavy decoration-yellow-300">Products</span>
        </h1>
        <p className="text-lg font-medium max-w-2xl mx-auto">
          Find the perfect products tailored to your style and needs.
        </p>
      </div>

      {/* Categories Section */}
      <div className="py-12 relative z-50">
        <Categories onCategorySelect={handleCategoryChange} />
      </div>

      {/* Products Section */}
      <div className="container mx-auto py-8 px-4">
        {products.length === 0 ? (
          <p className="text-lg text-center mt-8">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: Product) => (
              <div
                key={product.id}
                className={`${darkMode
                  ? 'bg-gray-800 text-white'
                  : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900'
                  } rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2 hover:scale-105`}
              >
                <div
                  className={`h-56 overflow-hidden ${!product.imageUrls[0]
                    ? 'bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500'
                    : ''
                    }`}
                >
                  {product.imageUrls[0] ? (
                    <img
                      src={product.imageUrls[0]}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                      No Image Available
                    </div>
                  )}
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <p className="text-lg font-medium mt-2">${product.price}</p>
                  <button
                    onClick={() => handleViewDetails(product.id)}
                    className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition transform hover:scale-105"
                    aria-label={`View details for ${product.name}`}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Section */}
      <div className="flex justify-center space-x-4 mt-8">
        <button
          disabled={pagination.page <= 1}
          onClick={() => handlePageChange(pagination.page - 1)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition"
        >
          Previous
        </button>
        <span className="text-lg font-semibold">Page {pagination.page}</span>
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
