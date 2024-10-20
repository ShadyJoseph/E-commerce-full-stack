
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
  const [orderPlaced, setOrderPlaced] = useState(false); // State for order confirmation message
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    // Basic validation
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
      // Show order placed message
      setOrderPlaced(true);
      console.log("Order placed with items:", state.cart);

      // Navigate to home after 4 seconds
      setTimeout(() => {
        navigate('/'); // Change this to your home route if different
      }, 4000);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 mt-[98px]">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {orderPlaced && (
              <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md text-lg font-semibold text-center">
                Your order has been placed successfully!
              </div>
            )}
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Checkout</h2>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Shipping Address</h3>
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6">
                {['firstName', 'lastName', 'streetAddress', 'city', 'state', 'zip'].map((field, index) => (
                  <div key={index} className={`sm:col-span-${field === 'streetAddress' ? '3' : '1'}`}>
                    <label htmlFor={field} className="block text-sm font-medium text-gray-700">{field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</label>
                    <input
                      type="text"
                      name={field}
                      id={field}
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                      className={`mt-1 focus:ring-green-500 focus:border-green-500 block w-full h-12 shadow-sm sm:text-sm border ${errors[field] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    />
                    {errors[field] && <p className="mt-1 text-sm text-red-500">{errors[field]}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Information</h3>
              <div className="flex items-center mb-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  id="creditCard"
                  value="creditCard"
                  checked={paymentMethod === 'creditCard'}
                  onChange={() => setPaymentMethod('creditCard')}
                  className="mr-2"
                />
                <label htmlFor="creditCard" className="mr-4 text-sm font-medium text-gray-700">Credit Card</label>

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
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6">
                  <div className="sm:col-span-2">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      id="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="Enter your card number"
                      className={`mt-1 focus:ring-green-500 focus:border-green-500 block w-full h-12 shadow-sm sm:text-sm border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-md`}
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
                      className={`mt-1 focus:ring-green-500 focus:border-green-500 block w-full h-12 shadow-sm sm:text-sm border ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded-md`}
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
                      className={`mt-1 focus:ring-green-500 focus:border-green-500 block w-full h-12 shadow-sm sm:text-sm border ${errors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    />
                    {errors.cvv && <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Place Order Button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutDetails;
