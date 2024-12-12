import React from 'react';
import Navbar from './Navbar/Navbar';
import { Footer } from './footer/Footer';
import ScrollToTop from '../ScrollToTop';

interface LayoutProps {
  children: React.ReactNode;
  onInschrijfClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onInschrijfClick }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar onInschrijfClick={onInschrijfClick} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer onInschrijfClick={onInschrijfClick} />
    </div>
  );
};

export default Layout; 