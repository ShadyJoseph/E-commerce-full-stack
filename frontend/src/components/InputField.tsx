import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

interface InputFieldProps {
    id: string;
    label: string;
    type: string;
    showToggle?: boolean;
    toggleVisibility?: () => void;
    disabled: boolean;
  }

// Reusable Input Field Component
const InputField: React.FC<InputFieldProps> = ({ id, label, type, showToggle, toggleVisibility, disabled }) => (
    <div className="relative mb-4">
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <Field
        type={showToggle ? 'text' : type}
        id={id}
        name={id}
        aria-describedby={`${id}-error`}
        className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primaryColor ${
          disabled ? 'bg-gray-200 cursor-not-allowed' : ''
        }`}
        disabled={disabled}
      />
      {type === 'password' && (
        <span
          className="absolute right-3 top-10 text-gray-600 cursor-pointer"
          onClick={toggleVisibility}
          aria-label={showToggle ? 'Hide password' : 'Show password'}
        >
          {showToggle ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
        </span>
      )}
      <ErrorMessage name={id} component="div" id={`${id}-error`} className="text-red-500 text-sm mt-1" />
    </div>
  );


  export default InputField;