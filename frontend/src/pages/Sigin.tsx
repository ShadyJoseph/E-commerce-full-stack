import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from '../stores/authStore';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Loader from '../components/Loader';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = React.useState(false);

  // Access Zustand store actions and state
  const login = useAuthStore((state) => state.login);
  const googleLogin = useAuthStore((state) => state.googleLogin);

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
  });

  const handleUserLogin = async (
    values: { email: string; password: string },
    { setSubmitting, setFieldError }: any
  ) => {
    try {
      const success = await login(values.email, values.password);
      if (success) navigate('/dashboard'); // Redirect only if login was successful
    } catch (error: any) {
      setFieldError('submit', error?.message || 'Failed to sign in');
    } finally {
      setSubmitting(false);
    }
  };


  const handleGoogleSignIn = () => {
    setIsGoogleSigningIn(true);
    googleLogin();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 transition-all">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">Welcome Back!</h2>

        <Formik
          initialValues={{ email: '', password: '', submit: '' }}
          validationSchema={validationSchema}
          onSubmit={handleUserLogin}
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
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-200">Email:</label>
                <Field
                  type="email"
                  name="email"
                  className={`w-full px-4 py-3 mt-1 border rounded-md transition-all ${(isSubmitting || isGoogleSigningIn) ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  disabled={isSubmitting || isGoogleSigningIn}
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-200">Password:</label>
                <Field
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`w-full px-4 py-3 mt-1 border rounded-md transition-all ${(isSubmitting || isGoogleSigningIn) ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                className={`w-full px-4 py-2 text-white font-semibold rounded-md transition duration-150 ease-in-out ${(isSubmitting || isGoogleSigningIn) ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {isSubmitting ? <Loader height="25" width="25" aria-label="Loading..." /> : 'Sign In'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-4">
          <GoogleSignInButton isLoading={isGoogleSigningIn} onClick={handleGoogleSignIn} mssg="Sign In With Google" />
        </div>

        <div className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
