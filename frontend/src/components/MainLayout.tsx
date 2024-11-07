import React, { ReactNode } from 'react';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className="content">{children}</main>
    </div>
  );
};

export default MainLayout;
