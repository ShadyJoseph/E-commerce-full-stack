import React from "react";
import { useAppSelector } from '../hooks/reduxHooks';

// Define types for the form fields
interface FormFieldStyle {
  backgroundColor: string;
  borderColor: string;
  color: string;
  borderWidth: string;
  borderRadius: string;
  padding: string;
}

const CheckOut: React.FC = () => {
  // Access theme and darkMode from Redux store
  const darkMode = useAppSelector((state) => state.theme.darkMode);

  const formFieldStyle: FormFieldStyle = {
    backgroundColor: darkMode ? "#374151" : "#ffffff", 
    borderColor: darkMode ? "#4b5563" : "#e5e7eb", 
    color: darkMode ? "text-gray-300" : "text-gray-900",
    borderWidth: "1px",
    borderRadius: "0.375rem",
    padding: "0.75rem 1rem", 
  };

  const labelStyle: React.CSSProperties = {
    color: darkMode ? "text-gray-400" : "text-gray-700", 
  };

  return (
    <div
      className={`min-h-screen mt-4 py-12 px-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-all`}
      style={{ backgroundColor: darkMode ? "#1f2937" : "#f9fafb", color: "text-gray-900" }} 
    >
      <div className={`max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-2xl font-bold mb-6" style={{ color: darkMode ? "#9333ea" : "#4f46e5" }}> 
          Checkout
        </h2>
        <form>
          {/* Shipping Address */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4" style={labelStyle}>
              Shipping Address
            </h3>
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6">
              <div className="sm:col-span-1">
                <label htmlFor="first_name" className="block text-sm font-medium mb-1" style={labelStyle}>
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  className="w-full"
                  style={formFieldStyle}
                />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="last_name" className="block text-sm font-medium mb-1" style={labelStyle}>
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  className="w-full"
                  style={formFieldStyle}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium mb-1" style={labelStyle}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full"
                  style={formFieldStyle}
                />
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="street_address" className="block text-sm font-medium mb-1" style={labelStyle}>
                  Street Address
                </label>
                <input
                  type="text"
                  id="street_address"
                  className="w-full"
                  style={formFieldStyle}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="city" className="block text-sm font-medium mb-1" style={labelStyle}>
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  className="w-full"
                  style={formFieldStyle}
                />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="state" className="block text-sm font-medium mb-1" style={labelStyle}>
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  className="w-full"
                  style={formFieldStyle}
                />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="zip" className="block text-sm font-medium mb-1" style={labelStyle}>
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zip"
                  className="w-full"
                  style={formFieldStyle}
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4" style={labelStyle}>
              Payment Information
            </h3>
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6">
              <div className="sm:col-span-2">
                <label htmlFor="card_number" className="block text-sm font-medium mb-1" style={labelStyle}>
                  Card Number
                </label>
                <input
                  type="text"
                  id="card_number"
                  className="w-full"
                  style={formFieldStyle}
                />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="expiry_date" className="block text-sm font-medium mb-1" style={labelStyle}>
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="expiry_date"
                  className="w-full"
                  style={formFieldStyle}
                />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="cvv" className="block text-sm font-medium mb-1" style={labelStyle}>
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  className="w-full"
                  style={formFieldStyle}
                />
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            type="submit"
            className="w-full py-4 text-lg font-semibold rounded-md transition-transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            style={{
              backgroundColor: darkMode ? "#9333ea" : "#4f46e5", 
              color: "white",
            }}
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckOut;
