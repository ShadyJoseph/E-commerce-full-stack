import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext'; 

// Reusable Input Field Component
const InputField = ({ id, label, type, formik, showToggle, toggleVisibility }) => (
  <div className="mb-4 relative">
    <label className="block text-sm font-medium mb-1" htmlFor={id}>
      {label}
    </label>
    <input
      type={showToggle ? 'text' : type}
      id={id}
      aria-describedby={`${id}-error`}
      {...formik.getFieldProps(id)}
      className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primaryColor ${
        formik.touched[id] && formik.errors[id] ? 'border-red-500' : ''
      }`}
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
    {formik.touched[id] && formik.errors[id] && (
      <div id={`${id}-error`} className="text-red-500 text-sm mt-1">
        {formik.errors[id]}
      </div>
    )}
  </div>
);

const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useAuth(); 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const getPasswordStrength = (password) => {
    const strengthConditions = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[@$!%*?&]/.test(password),
    ];
    const metConditions = strengthConditions.filter(Boolean).length;

    if (metConditions <= 2) return 'Weak';
    if (metConditions === 3) return 'Moderate';
    return 'Strong';
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First name is required.'),
      lastName: Yup.string().required('Last name is required.'),
      email: Yup.string()
        .email('Invalid email format.')
        .required('Email is required.'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters long.')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
        .matches(/\d/, 'Password must contain at least one digit.')
        .matches(/[@$!%*?&]/, 'Password must contain at least one special character.')
        .required('Password is required.'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], "Passwords don't match")
        .required('Confirm Password is required.'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      setSubmitError('');

      try {
        // Call the register function from the context
        await register(values.firstName, values.lastName, values.email, values.password);
        navigate('/'); // Navigate to home page after successful registration
      } catch (error) {
        setSubmitError(error.message); // Set the error message if registration fails
      } finally {
        setSubmitting(false); // Stop the loader
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>

        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{submitError}</span>
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          <InputField id="firstName" label="First Name" type="text" formik={formik} />
          <InputField id="lastName" label="Last Name" type="text" formik={formik} />
          <InputField id="email" label="Email" type="email" formik={formik} />

          <InputField
            id="password"
            label="Password"
            type="password"
            formik={formik}
            showToggle={showPassword}
            toggleVisibility={() => setShowPassword(!showPassword)}
          />
          <p
            className={`mt-1 text-sm ${
              getPasswordStrength(formik.values.password) === 'Strong'
                ? 'text-green-500'
                : getPasswordStrength(formik.values.password) === 'Moderate'
                ? 'text-yellow-500'
                : 'text-red-500'
            }`}
          >
            Password Strength: {getPasswordStrength(formik.values.password)}
          </p>

          <InputField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            formik={formik}
            showToggle={showConfirmPassword}
            toggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
          />
         <button
  type="submit"
  className={`w-full p-2 rounded transition duration-200 flex items-center justify-center ${
    formik.isSubmitting
      ? 'bg-gray-400 cursor-not-allowed'
      : 'bg-green-500 text-white hover:bg-green-600'
  }`}
  disabled={formik.isSubmitting}
>
  {formik.isSubmitting ? <Loader height="25" width="25" /> : 'Sign Up'}
</button>
        </form>

        <div className="mt-4 text-sm text-center">
          <span>Already have an account? </span>
          <Link to="/signin" className="text-green-500 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
