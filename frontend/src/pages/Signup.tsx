import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import Loader from '../components/Loader';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import InputField from '../components/InputField';
import ValidationSchema from '../components/SignUpValidations';


const Signup = () => {
  const navigate = useNavigate();
  const { darkMode } = useThemeStore();
  const signUp = useAuthStore((state) => state.signUp);
  const googleLogin = useAuthStore((state) => state.googleLogin);

  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  const handleUserSignup = async (
    values: { email: string; password: string; displayName: string },
    { setSubmitting, setFieldError }: { setSubmitting: (isSubmitting: boolean) => void; setFieldError: (field: string, message: string) => void }
  ) => {
    try {
      const success = await signUp(values.email, values.password, values.displayName);
      if (success) navigate('/dashboard');
    } catch (error) {
      setFieldError('submit', (error as Error)?.message || 'Failed to sign up');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsGoogleSigningIn(true);
    googleLogin();
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'} transition-colors`}>
      <div className={`w-full max-w-md p-8 rounded-lg shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} transition-all`}>
        <h2 className={`text-3xl font-bold text-center ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-6`}>Create Account</h2>

        <Formik
          initialValues={{ displayName: '', email: '', password: '', submit: '' }}
          validationSchema={ValidationSchema}
          onSubmit={handleUserSignup}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-6">
              {errors.submit && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert" aria-live="assertive">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{errors.submit}</span>
                </div>
              )}

              <InputField
                id="displayName"
                label="Display Name:"
                type="text"
                showToggle={false}
                disabled={isSubmitting || isGoogleSigningIn}
              />

              <InputField
                id="email"
                label="Email:"
                type="email"
                showToggle={false}
                disabled={isSubmitting || isGoogleSigningIn}
              />

              <InputField
                id="password"
                label="Password:"
                type="password"
                showToggle={showPassword}
                toggleVisibility={() => setShowPassword(!showPassword)}
                disabled={isSubmitting || isGoogleSigningIn}
              />

              <button
                type="submit"
                disabled={isSubmitting || isGoogleSigningIn}
                className={`w-full px-4 py-2 text-white font-semibold rounded-md transition duration-150 ease-in-out ${
                  isSubmitting || isGoogleSigningIn ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? <Loader height="25" width="25" aria-label="Loading..." /> : 'Sign Up'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-4">
          <GoogleSignInButton isLoading={isGoogleSigningIn} onClick={handleGoogleSignIn} mssg="Sign Up With Google" />
        </div>

        <div className="mt-4 text-sm text-center">
          Already have an account?{' '}
          <Link to="/" className={`text-blue-600 hover:underline ${darkMode ? 'dark:text-blue-400' : ''}`} aria-label="Navigate to Sign In">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
