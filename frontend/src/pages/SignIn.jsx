import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context
  const [showPassword, setShowPassword] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters long')
        .required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setSubmitting(true); // Start the loader
      try {
        // Simulate an API call with setTimeout for the loader
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            const isSuccess = true; // Simulate success/failure
            if (isSuccess) {
              const user = { email: values.email, firstName: 'John', role: 0 }; // Simulate user object
              login(user); // Call the login function from context
              resolve();
              navigate('/'); // Simulate navigation after login
            } else {
              reject(new Error('Incorrect email or password. Please try again.'));
            }
          }, 2000); // 2-second loader delay
        });
      } catch (err) {
        setErrors({ submit: err.message });
      } finally {
        setSubmitting(false); // Stop the loader
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">Sign In</h2>

        {/* Submit Error Handling */}
        {formik.errors.submit && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{formik.errors.submit}</span>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...formik.getFieldProps('email')}
              className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 
                ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
              aria-label="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
            )}
          </div>

          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              {...formik.getFieldProps('password')}
              className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 
                ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
              aria-label="Enter your password"
            />
            <button
              type="button"
              className="absolute right-3 top-10 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
            )}
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="rememberMe"
              {...formik.getFieldProps('rememberMe')}
              className="mr-2"
              aria-label="Remember me"
            />
            <label htmlFor="rememberMe" className="text-sm">
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            className={`w-full p-2 rounded transition duration-200 flex items-center justify-center 
              ${formik.isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'} text-white`}
            disabled={formik.isSubmitting}
            aria-label={formik.isSubmitting ? 'Signing in' : 'Sign In'}
          >
            {formik.isSubmitting ? (
              <Loader height="25" width="25" className="mr-2" aria-label="Loading..." />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-2 text-sm text-center">
          <span>Don't have an account? </span>
          <Link to="/signup" className="text-green-600 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
