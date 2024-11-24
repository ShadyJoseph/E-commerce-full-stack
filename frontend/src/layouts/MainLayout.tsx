import React, { ReactNode } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useThemeStore } from '../stores/themeStore'; // Importing theme store

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { darkMode } = useThemeStore(); // Access darkMode from the store

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen`}>
      <Navbar />
      <main className="content py-16">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
