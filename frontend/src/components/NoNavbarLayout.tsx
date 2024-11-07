import React, { ReactNode } from 'react';

interface NoNavbarLayoutProps {
  children: ReactNode;
}

const NoNavbarLayout: React.FC<NoNavbarLayoutProps> = ({ children }) => {
  return <main className="content">{children}</main>;
};

export default NoNavbarLayout;
