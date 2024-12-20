import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { RootState } from '../stores/store';

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  showToggle?: boolean;
  toggleVisibility?: () => void;
  disabled: boolean;
}

// Reusable Input Field Component
const InputField: React.FC<InputFieldProps> = ({ id, label, type, showToggle, toggleVisibility, disabled }) => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode); // Access darkMode state from Redux

  return (
    <div className="relative mb-4">
      <label
        htmlFor={id}
        className={`block text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-blue-600'}`}
      >
        {label}
      </label>
      <Field
        type={showToggle ? 'text' : type}
        id={id}
        name={id}
        aria-describedby={`${id}-error`}
        className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primaryColor ${disabled ? 'bg-gray-200 cursor-not-allowed' : ''
          } ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
        disabled={disabled}
      />
      {type === 'password' && (
        <span
          className="absolute right-3 top-10 text-gray-600 cursor-pointer"
          onClick={toggleVisibility}
          aria-label={showToggle ? 'Hide password' : 'Show password'}
        >
          {showToggle ? (
            <AiOutlineEye color={darkMode ? 'white' : 'grey'} />
          ) : (
            <AiOutlineEyeInvisible color={darkMode ? 'white' : 'grey'} />
          )}
        </span>
      )}
      <ErrorMessage
        name={id}
        component="div"
        id={`${id}-error`}
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
};

export default InputField;
