import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchAllProducts } from '../stores/slices/productSlice';
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

  // Fetch products whenever pagination changes
  useEffect(() => {
    dispatch(fetchAllProducts(pagination));
  }, [dispatch, pagination]);

  // Handlers
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleViewDetails = (id: number) => {
    if (id) {
      navigate(`/products/${id}`);
    } else {
      console.error('Invalid product ID: Cannot navigate.');
    }
  };

  const handleCategoryChange = (category: string) => {
    setPagination((prev) => ({ ...prev, category, page: 1 }));
    navigate(`/products?category=${category}`);
  };

  // Render loading state
  if (loading) return <Loader />;

  // Render error state
  if (error) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-500 text-lg">Failed to load products. {error}</p>
        <button
          onClick={() => dispatch(fetchAllProducts(pagination))}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen`}>
      {/* Banner Section */}
      <header
        className={`${darkMode
          ? 'bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-700'
          : 'bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500'
          } text-white py-28 text-center shadow-lg`}
      >
        <h1 className="text-5xl font-extrabold mb-6 tracking-wide animate-fadeIn">
          Explore Our <span className="underline decoration-wavy decoration-yellow-300">Products</span>
        </h1>
        <p className="text-lg font-medium max-w-2xl mx-auto opacity-90">
          Find the perfect products tailored to your style and needs.
        </p>
      </header>

      {/* Categories Section */}
      <section className="py-12 relative z-50">
        <Categories onCategorySelect={handleCategoryChange} />
      </section>

      {/* Products Section */}
      <main className="container mx-auto py-8 px-4">
        {products.length === 0 ? (
          <p className="text-lg text-center mt-8">No products found.</p>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-card-light dark:bg-card-dark rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2"
              >
                <div className="h-56 overflow-hidden rounded-t-lg">
                  {product.imageUrls && product.imageUrls[0] ? (
                    <img
                      src={product.imageUrls[0]}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-300 text-gray-500">
                      No Image Available
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">{product.name}</h3>
                  <p className="mt-1 text-gray-500 capitalize">{product.category}</p>
                  <p className="mt-2 text-lg font-bold">${product.price}</p>
                  <button
                    onClick={() => handleViewDetails(product._id)}
                    className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
                    aria-label={`View details for ${product.name}`}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Pagination Section */}
      <footer className="flex justify-center items-center space-x-6 mt-8">
        <button
          disabled={pagination.page <= 1}
          onClick={() => handlePageChange(pagination.page - 1)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition-transform transform hover:scale-105"
        >
          Previous
        </button>
        <span className="text-lg font-semibold px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200 rounded-md">
          Page {pagination.page}
        </span>
        <button
          disabled={products.length < pagination.limit}
          onClick={() => handlePageChange(pagination.page + 1)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition-transform transform hover:scale-105"
        >
          Next
        </button>
      </footer>
    </div>
  );
};

export default ProductsPage;