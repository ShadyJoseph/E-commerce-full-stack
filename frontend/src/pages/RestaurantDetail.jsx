import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import pasta from '../assets/pasta.jpg';
import sushi from '../assets/sushi1.jpg';
import tacos from '../assets/tacos.jpg';
import StarRating from '../components/StarRating';

const restaurants = [
  {
    id: 1,
    name: "Pasta Palace",
    address: "456 Noodle Ave, Flavor Town, FT 12345",
    items: [
      { id: 1, name: "Spaghetti Carbonara", price: 12.99 },
      { id: 2, name: "Fettuccine Alfredo", price: 11.99 },
      { id: 3, name: "Penne Arrabbiata", price: 10.99 },
    ],
    rating: 4.5,
    image: pasta,
    description: "A cozy place serving delicious pasta dishes made with love.",
    openingHours: "Mon-Sun: 10 AM - 10 PM",
    phone: "(123) 456-7890",
    reviews: [
      { id: 1, user: "John D.", comment: "Best pasta I've ever had!" },
      { id: 2, user: "Jane S.", comment: "Great atmosphere and friendly staff." },
    ],
  },
  {
    id: 2,
    name: "Sushi Spot",
    address: "789 Sushi St, Flavor Town, FT 12345",
    items: [
      { id: 1, name: "California Roll", price: 9.99 },
      { id: 2, name: "Spicy Tuna Roll", price: 10.99 },
      { id: 3, name: "Salmon Sashimi", price: 14.99 },
    ],
    rating: 4.8,
    image: sushi,
    description: "Fresh sushi made by expert chefs with the best ingredients.",
    openingHours: "Mon-Sun: 11 AM - 11 PM",
    phone: "(123) 654-3210",
    reviews: [
      { id: 1, user: "Anna P.", comment: "Always fresh and delicious!" },
      { id: 2, user: "Mike T.", comment: "The best sushi in town!" },
    ],
  },
  {
    id: 3,
    name: "Taco Haven",
    address: "321 Taco Rd, Flavor Town, FT 12345",
    items: [
      { id: 1, name: "Taco Al Pastor", price: 3.99 },
      { id: 2, name: "Baja Fish Taco", price: 4.49 },
      { id: 3, name: "Vegetarian Taco", price: 3.49 },
    ],
    rating: 4.6,
    image: tacos,
    description: "A vibrant spot for authentic Mexican tacos made with fresh ingredients.",
    openingHours: "Mon-Sun: 12 PM - 9 PM",
    phone: "(321) 654-0987",
    reviews: [
      { id: 1, user: "Laura R.", comment: "Amazing tacos! My favorite place for a quick bite." },
      { id: 2, user: "Tom W.", comment: "Great flavors and friendly service." },
    ],
  },
];

const RestaurantDetail = () => {
  const { id } = useParams();
  const restaurant = restaurants.find((r) => r.id === parseInt(id));
  const { addToCart } = useCart();
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!restaurant) {
    return <div className="text-center">Restaurant not found.</div>;
  }

  const handleAddReview = () => {
    if (reviewText) {
      restaurant.reviews.push({
        id: restaurant.reviews.length + 1,
        user: "You",
        comment: reviewText,
      });
      setReviewSubmitted(true);
      setReviewText('');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen mt-16 p-6">
      <div className="container mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-6 text-center">{restaurant.name}</h1>
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 object-cover rounded-lg mb-4" />
        <p className="text-gray-700 mb-2">{restaurant.address}</p>
        <div className="flex items-center mb-2">
          <StarRating rating={restaurant.rating} />
          <span className="ml-2 text-yellow-500 font-semibold">Rating: {restaurant.rating} ★</span>
        </div>
        <p className="text-gray-700 mb-4">{restaurant.description}</p>

        <h3 className="font-semibold mb-2">Available Items:</h3>
        <ul className="list-disc pl-5 mb-4">
          {restaurant.items.map((item) => (
            <li key={item.id} className="text-gray-700 flex justify-between items-center">
              <span>{item.name} - ${item.price.toFixed(2)}</span>
              <button
                onClick={() => addToCart({ id: item.id, name: item.name, price: item.price })}
                className="bg-green-600 text-white py-1 px-3 rounded-full shadow-lg hover:bg-green-700 transition duration-300 mb-2"
              >
                Add to Cart
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Contact Information:</h3>
          <p className="text-gray-700">Phone: {restaurant.phone}</p>
          <p className="text-gray-700">Opening Hours: {restaurant.openingHours}</p>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Reviews:</h3>
          <ul className="list-disc pl-5 mb-4">
            {restaurant.reviews.map((review) => (
              <li key={review.id} className="text-gray-700">
                <strong>{review.user}:</strong> {review.comment}
              </li>
            ))}
          </ul>

          {!reviewSubmitted && (
            <div className="mt-4">
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                placeholder="Write a review..."
              />
              <button
                onClick={handleAddReview}
                className="bg-green-600 text-white py-1 px-3 rounded-full shadow-lg hover:bg-green-700 transition duration-300 mb-4"
              >
                Submit Review
              </button>
            </div>
          )}
        </div>

        <Link
          to="/restaurants"
          className="bg-green-600 text-white py-2 px-4 rounded-full shadow-lg hover:bg-green-700 transition duration-300"
        >
          Back to Restaurants
        </Link>
      </div>
    </div>
  );
};

export default RestaurantDetail;
