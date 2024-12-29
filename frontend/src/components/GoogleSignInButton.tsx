import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../stores/store';
import Loader from './Loader';
import classNames from 'classnames';

interface GoogleSignInButtonProps {
  isLoading: boolean;
  onClick: () => void;
  mssg: string;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ isLoading, onClick, mssg }) => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const buttonClasses = useMemo(() => {
    return classNames(
      'flex items-center justify-center w-full h-12 px-6 font-semibold rounded-full border transition-all',
      {
        'bg-gray-200 dark:bg-gray-700 cursor-not-allowed': isLoading,
        'bg-gray-800 dark:bg-gray-700 border-gray-600 hover:bg-gray-700 dark:hover:bg-gray-600 shadow-sm hover:shadow-lg': darkMode && !isLoading,
        'bg-white dark:bg-gray-800 border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm hover:shadow-lg': !darkMode && !isLoading,
        'text-gray-700 dark:text-gray-200': !isLoading,
      }
    );
  }, [isLoading, darkMode]);

  const messageClasses = useMemo(() => {
    return classNames('transition-colors duration-300', {
      'text-gray-200': darkMode,
      'text-gray-700': !darkMode,
    });
  }, [darkMode]);

  return (
    <div className="flex items-center justify-center w-full">
      <button
        onClick={onClick}
        disabled={isLoading}
        aria-label={mssg}
        aria-busy={isLoading}
        className={buttonClasses}
        aria-live={isLoading ? 'assertive' : 'off'}
      >
        {isLoading ? (
          <Loader height="25" width="25" aria-label="Loading..." />
        ) : (
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              height="24px"
              width="24px"
              className="mr-2"
            >
              <g fill="none" fillRule="evenodd">
                <g transform="translate(3, 2)">
                  <path
                    fill="#4285F4"
                    d="M57.8 30.1C57.8 27.7 57.6 26 57.2 24.1H29.5v10.9h16.3c-.3 2.7-2.1 6.8-6.1 9.5l8.7 6.8c5.6-5.3 8.4-13.9 8.4-21.2z"
                  />
                  <path
                    fill="#34A853"
                    d="M29.5 59c7.9 0 14.6-2.6 19.5-7.2L39.7 44.6c-2.5 1.7-5.8 2.9-10.2 2.9-8.4 0-15-6.3-17.5-14.3L3.1 42.7c3.3 9.6 12.9 16.3 24.7 16.3z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M12.7 35.3c-.6-1.8-.9-3.7-.9-5.8 0-2 .3-4 .9-5.8L3.4 16.1C1.1 20.3 0 24.7 0 29.5c0 4.7 1.1 9.2 3.1 13.1l9.6-7.3z"
                  />
                  <path
                    fill="#EB4335"
                    d="M29.5 11.4c4.6 0 8.2 1.6 10.9 3.9l8.3-8.1C44.1 2.9 37.5 0 29.5 0 17.9 0 8 6.6 3.1 16.3L12.7 23.7c2.5-7.9 9.1-13.3 16.8-13.3z"
                  />
                </g>
              </g>
            </svg>
            <span className={messageClasses}>{mssg}</span>
          </div>
        )}
      </button>
    </div>
  );
};

export default GoogleSignInButton;