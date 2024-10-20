
import React from 'react';

// Star component for individual star icons
const Star = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`w-6 h-6 ${filled ? 'text-yellow-500' : 'text-gray-300'}`}
    fill={filled ? 'currentColor' : 'none'}
    viewBox="0 0 24 24"
    stroke={filled ? 'none' : 'currentColor'}
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
    />
  </svg>
);

// StarRating component
const StarRating = ({ rating, maxRating = 5 }) => {
  // Calculate the number of filled, half, and empty stars
  const filledStars = Math.floor(rating);
  const halfStar = rating - filledStars >= 0.5 ? 1 : 0;
  const emptyStars = maxRating - filledStars - halfStar;

  return (
    <div className="flex items-center">
      {/* Render filled stars */}
      {Array(filledStars)
        .fill()
        .map((_, index) => (
          <Star key={index} filled={true} />
        ))}

      {/* Render half star if applicable */}
      {halfStar === 1 && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-yellow-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <defs>
            <linearGradient id="half" x1="0" x2="1" y1="0" y2="0">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            stroke="none"
            fill="url(#half)"
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      )}

      {/* Render empty stars */}
      {Array(emptyStars)
        .fill()
        .map((_, index) => (
          <Star key={index + filledStars + 1} filled={false} />
        ))}
    </div>
  );
};

export default StarRating;
