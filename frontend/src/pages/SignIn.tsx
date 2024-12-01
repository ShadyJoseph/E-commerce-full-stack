import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { login } from '../stores/slices/authSlice';
import GoogleSignInButton from '../components/GoogleSignInButton';
import Loader from '../components/Loader';
import InputField from '../components/InputField';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loading: isSubmitting } = useAppSelector((state) => state.auth); // Auth state from Redux
  const { darkMode } = useAppSelector((state) => state.theme); // Theme state from Redux

  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
  });

  const handleUserLogin = async (
    values: { email: string; password: string },
    { setSubmitting, setFieldError }: { setSubmitting: (isSubmitting: boolean) => void; setFieldError: (field: string, message: string) => void }
  ) => {
    try {
      const resultAction = await dispatch(login({ email: values.email, password: values.password }));
      if (login.fulfilled.match(resultAction)) {
        navigate('/');
      } else if (login.rejected.match(resultAction) && resultAction.payload) {
        setFieldError('submit', resultAction.payload); // Payload contains string error
      } else {
        setFieldError('submit', 'Unexpected error occurred.');
      }
    } catch (error) {
      console.error('[SignIn] Login error:', error);
      setFieldError('submit', 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsGoogleSigningIn(true);
    const redirectUri = `${process.env.REACT_APP_FRONTEND_URL}/google/callback`;
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
  };
  

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors`}>
      <div className={`w-full max-w-md p-8 rounded-lg shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} transition-all`}>
        <h2 className={`text-3xl font-bold text-center ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-6`}>Welcome Back!</h2>

        <Formik
          initialValues={{ email: '', password: '', submit: '' }}
          validationSchema={validationSchema}
          onSubmit={handleUserLogin}
        >
          {({ errors }) => (
            <Form className="space-y-6">
              {errors.submit && (
                <div className="animate-pulse bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span>{errors.submit}</span>
                </div>
              )}

              <InputField
                id="email"
                label="Email:"
                type="email"
                disabled={isSubmitting || isGoogleSigningIn}
              />

              <InputField
                id="password"
                label="Password:"
                type={showPassword ? 'text' : 'password'}
                showToggle={showPassword}
                toggleVisibility={() => setShowPassword(!showPassword)}
                disabled={isSubmitting || isGoogleSigningIn}
              />

              <button
                type="submit"
                disabled={isSubmitting || isGoogleSigningIn}
                className={`w-full px-4 py-2 text-white font-semibold rounded-md transition duration-150 ease-in-out ${isSubmitting || isGoogleSigningIn ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isSubmitting ? <Loader height="25" width="25" aria-label="Loading..." /> : 'Sign In'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-4">
          <GoogleSignInButton isLoading={isGoogleSigningIn} onClick={handleGoogleSignIn} mssg="Sign In With Google" />
        </div>

        <div className="mt-4 text-sm text-center">
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
