import React, { ReactNode } from 'react';
import { useThemeStore } from '../stores/themeStore'; // Importing theme store

interface NoNavbarLayoutProps {
  children: ReactNode;
}

const NoNavbarLayout: React.FC<NoNavbarLayoutProps> = ({ children }) => {
  const { darkMode } = useThemeStore(); // Access darkMode from the store

  return (
    <main className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen`}>
      {children}
    </main>
  );
};

export default NoNavbarLayout;
