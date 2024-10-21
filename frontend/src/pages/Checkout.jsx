
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CheckOutDetails = () => {
  const { state } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    streetAddress: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false); // New state for loading
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.streetAddress) newErrors.streetAddress = 'Street address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zip) newErrors.zip = 'ZIP code is required';
    if (paymentMethod === 'creditCard') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
      if (!formData.cvv) newErrors.cvv = 'CVV is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (validate()) {
      setLoading(true); // Start loading
      setTimeout(() => {
        setOrderPlaced(true);
        console.log("Order placed with items:", state.cart);

        setLoading(false); // Stop loading after timeout
        setTimeout(() => {
          navigate('/'); // Navigate to home after order is placed
        }, 4000); // Wait before redirecting
      }, 3000); // Simulate order processing with a 3-second delay
    }
  };

  return (
    <div className="min-h-screen bg-green-50 mt-[98px]">
      <div className="max-w-7xl mx-auto py-12 px-6 sm:px-8 lg:px-12">
        <div className="bg-white shadow-lg sm:rounded-lg p-8 transition-all duration-300">
          {orderPlaced && (
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md text-lg font-semibold text-center animate-fade-in">
              Your order has been placed successfully!
            </div>
          )}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h2>

          {/* Shipping Address Section */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {['firstName', 'lastName', 'streetAddress', 'city', 'state', 'zip'].map((field, index) => (
                <div key={index} className={`col-span-${field === 'streetAddress' ? '2 lg:col-span-3' : '1'}`}>
                  <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  <input
                    type="text"
                    name={field}
                    id={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                    className={`mt-2 focus:ring-green-500 focus:border-green-500 block w-full h-12 rounded-md shadow-sm sm:text-sm border ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors[field] && <p className="mt-1 text-sm text-red-500">{errors[field]}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Payment Information Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h3>
            <div className="flex items-center mb-6">
              <input
                type="radio"
                name="paymentMethod"
                id="creditCard"
                value="creditCard"
                checked={paymentMethod === 'creditCard'}
                onChange={() => setPaymentMethod('creditCard')}
                className="mr-2"
              />
              <label htmlFor="creditCard" className="mr-6 text-sm font-medium text-gray-700">Credit Card</label>

              <input
                type="radio"
                name="paymentMethod"
                id="cashOnDelivery"
                value="cashOnDelivery"
                checked={paymentMethod === 'cashOnDelivery'}
                onChange={() => setPaymentMethod('cashOnDelivery')}
                className="mr-2"
              />
              <label htmlFor="cashOnDelivery" className="text-sm font-medium text-gray-700">Cash on Delivery</label>
            </div>

            {paymentMethod === 'creditCard' && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                <div className="sm:col-span-2 lg:col-span-3">
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    id="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="Enter your card number"
                    className={`mt-2 focus:ring-green-500 focus:border-green-500 block w-full h-12 rounded-md shadow-sm sm:text-sm border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.cardNumber && <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>}
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    id="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    className={`mt-2 focus:ring-green-500 focus:border-green-500 block w-full h-12 rounded-md shadow-sm sm:text-sm border ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.expiryDate && <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>}
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    id="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="Enter CVV"
                    className={`mt-2 focus:ring-green-500 focus:border-green-500 block w-full h-12 rounded-md shadow-sm sm:text-sm border ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.cvv && <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Place Order Button */}
          <div className="mt-8">
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={loading} // Disable button when loading
              className={`w-full inline-flex items-center justify-center px-6 py-4 border border-transparent rounded-md shadow-lg text-base font-medium text-white ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
             

 } transition-colors duration-300`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Placing Order...
                </>
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutDetails;
