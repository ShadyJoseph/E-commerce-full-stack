import React, { ReactNode } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAppSelector } from '../hooks/reduxHooks';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const darkMode = useAppSelector((state: { theme: { darkMode: boolean } }) => state.theme.darkMode);

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen`}>
      <Navbar />
      <main className="content py-16">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
