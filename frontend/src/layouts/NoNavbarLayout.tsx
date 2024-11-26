import React, { ReactNode } from 'react';
import { useAppSelector } from '../hooks/reduxHooks';

interface NoNavbarLayoutProps {
  children: ReactNode;
}

const NoNavbarLayout: React.FC<NoNavbarLayoutProps> = ({ children }) => {
  const darkMode = useAppSelector((state: { theme: { darkMode: boolean } }) => state.theme.darkMode);

  return (
    <main className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen`}>
      {children}
    </main>
  );
};

export default NoNavbarLayout;
