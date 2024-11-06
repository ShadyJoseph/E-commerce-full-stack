import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../api/axiosConfig';
import { setAuthToken } from '../api/endpoints/auth';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Loader from '../components/Loader';

interface LoginResponse {
  token: string;
  user: {
    email: string;
    displayName: string;
    role: string;
  };
}

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = React.useState(false);

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
  });

  const handleUserLogin = async (values: { email: string; password: string }, { setSubmitting, setFieldError }: any) => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', values);
      setAuthToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (error: any) {
      setFieldError('password', error.response?.data?.message || 'Failed to sign in');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsGoogleSigningIn(true);
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 transition-all">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">Welcome Back!</h2>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleUserLogin}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-200">Email:</label>
                <Field
                  type="email"
                  name="email"
                  className={`w-full px-4 py-3 mt-1 border rounded-md transition-all ${
                    (isSubmitting || isGoogleSigningIn) ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
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
                  className={`w-full px-4 py-3 mt-1 border rounded-md transition-all ${
                    (isSubmitting || isGoogleSigningIn) ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
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
                className={`w-full px-4 py-2 text-white font-semibold rounded-md transition duration-150 ease-in-out ${
                  (isSubmitting || isGoogleSigningIn) ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? <Loader height="25" width="25" aria-label="Loading..." /> : 'Sign In'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-4">
          <GoogleSignInButton isLoading={isGoogleSigningIn} onClick={handleGoogleSignIn} />
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
