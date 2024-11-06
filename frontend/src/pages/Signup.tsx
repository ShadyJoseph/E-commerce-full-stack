import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore'; // import the theme store
import GoogleSignInButton from '../components/GoogleSignInButton';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Loader from '../components/Loader';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = React.useState(false);

  const signUp = useAuthStore((state) => state.signUp);
  const googleLogin = useAuthStore((state) => state.googleLogin);

  // Access the darkMode from Zustand
  const darkMode = useThemeStore((state) => state.darkMode);

  const validationSchema = Yup.object({
    displayName: Yup.string().required('Display name is required').max(100, 'Cannot exceed 100 characters'),
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
  });

  const handleUserSignup = async (
    values: { displayName: string; email: string; password: string },
    { setSubmitting, setFieldError }: any
  ) => {
    try {
      const success = await signUp(values.email, values.password, values.displayName);
      if (success) navigate('/dashboard'); // Redirect only if signup was successful
    } catch (error: any) {
      setFieldError('submit', error?.message || 'Failed to sign up');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsGoogleSigningIn(true);
    googleLogin();
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors`}>
      <div className={`w-full max-w-md p-8 rounded-lg shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} transition-all`}>
        <h2 className={`text-3xl font-bold text-center ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-6`}>Create Account</h2>

        <Formik
          initialValues={{ displayName: '', email: '', password: '', submit: '' }}
          validationSchema={validationSchema}
          onSubmit={handleUserSignup}
        >
          {({ isSubmitting, errors }) => (
            <Form className="space-y-6">
              {errors.submit && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{errors.submit}</span>
                </div>
              )}

              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>Display Name:</label>
                <Field
                  type="text"
                  name="displayName"
                  className={`w-full px-4 py-3 mt-1 border rounded-md transition-all ${(isSubmitting || isGoogleSigningIn) ? 'bg-gray-200 cursor-not-allowed' : 'bg-white border-gray-300'} ${darkMode ? 'dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100' : ''} focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
                  disabled={isSubmitting || isGoogleSigningIn}
                />
                <ErrorMessage name="displayName" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>Email:</label>
                <Field
                  type="email"
                  name="email"
                  className={`w-full px-4 py-3 mt-1 border rounded-md transition-all ${(isSubmitting || isGoogleSigningIn) ? 'bg-gray-200 cursor-not-allowed' : 'bg-white border-gray-300'} ${darkMode ? 'dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100' : ''} focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
                  disabled={isSubmitting || isGoogleSigningIn}
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="relative">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>Password:</label>
                <Field
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`w-full px-4 py-3 mt-1 border rounded-md transition-all ${(isSubmitting || isGoogleSigningIn) ? 'bg-gray-200 cursor-not-allowed' : 'bg-white border-gray-300'} ${darkMode ? 'dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100' : ''} focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
                  disabled={isSubmitting || isGoogleSigningIn}
                />
                <button
                  type="button"
                  className="absolute right-3 top-10 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting || isGoogleSigningIn}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </button>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isGoogleSigningIn}
                className={`w-full px-4 py-2 text-white font-semibold rounded-md transition duration-150 ease-in-out ${isSubmitting || isGoogleSigningIn ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isSubmitting ? <Loader height="25" width="25" aria-label="Loading..." /> : 'Sign Up'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-4">
          <GoogleSignInButton isLoading={isGoogleSigningIn} onClick={handleGoogleSignIn} mssg="Sign Up With Google" />
        </div>

        <div className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <Link to="/" className={`text-blue-600 hover:underline ${darkMode ? 'dark:text-blue-400' : ''}`}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
