import React from "react";
import { useAppSelector } from "../hooks/reduxHooks";

interface FormFieldStyle {
  backgroundColor: string;
  borderColor: string;
  color: string;
  borderWidth: string;
  borderRadius: string;
  padding: string;
}

const CheckOut: React.FC = () => {
  const darkMode = useAppSelector((state) => state.theme.darkMode);

  const formFieldStyle: FormFieldStyle = {
    backgroundColor: darkMode ? "#374151" : "#ffffff",
    borderColor: darkMode ? "#4b5563" : "#e5e7eb",
    color: darkMode ? "#d1d5db" : "#111827",
    borderWidth: "1px",
    borderRadius: "0.375rem",
    padding: "0.75rem 1rem",
  };

  const labelStyle: React.CSSProperties = {
    color: darkMode ? "#9ca3af" : "#374151",
  };

  return (
    <div
      className={`min-h-screen mt-4 py-12 px-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } transition-all`}
    >
      <div
        className={`max-w-4xl mx-auto shadow-lg rounded-lg p-8 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2
          className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent"
          style={{
            backgroundImage: darkMode
              ? "linear-gradient(to right, #9333ea, #6b21a8)"
              : "linear-gradient(to right, #4f46e5, #6366f1)",
          }}
        >
          Checkout
        </h2>

        <form>
          {/* Shipping Address */}
          <div className="mb-8">
            <h3
              className="text-2xl font-semibold mb-4"
              style={{
                color: darkMode ? "#c4b5fd" : "#4f46e5",
              }}
            >
              Shipping Address
            </h3>
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6">
              {[
                { id: "first_name", label: "First Name", type: "text" },
                { id: "last_name", label: "Last Name", type: "text" },
                { id: "email", label: "Email Address", type: "email" },
                { id: "street_address", label: "Street Address", type: "text" },
                { id: "city", label: "City", type: "text" },
                { id: "state", label: "State", type: "text" },
                { id: "zip", label: "ZIP Code", type: "text" },
              ].map(({ id, label, type }, index) => (
                <div key={index} className="sm:col-span-1">
                  <label
                    htmlFor={id}
                    className="block text-sm font-medium mb-1"
                    style={labelStyle}
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    id={id}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className="w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    style={formFieldStyle}
                  />
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-500 mb-8" />

          {/* Payment Information */}
          <div className="mb-8">
            <h3
              className="text-2xl font-semibold mb-4"
              style={{
                color: darkMode ? "#c4b5fd" : "#4f46e5",
              }}
            >
              Payment Information
            </h3>
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6">
              {[
                { id: "card_number", label: "Card Number", type: "text" },
                { id: "expiry_date", label: "Expiry Date", type: "text" },
                { id: "cvv", label: "CVV", type: "text" },
              ].map(({ id, label, type }, index) => (
                <div key={index} className="sm:col-span-1">
                  <label
                    htmlFor={id}
                    className="block text-sm font-medium mb-1"
                    style={labelStyle}
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    id={id}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className="w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    style={formFieldStyle}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Place Order Button */}
          <button
            type="submit"
            className="w-full py-4 text-lg font-semibold rounded-md transition-transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 shadow-lg"
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
