import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import { Footer } from './footer';
import { FestiveEffects } from './FestiveEffects';

interface LayoutProps {
  onInschrijfClick: () => void;
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, onInschrijfClick }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <FestiveEffects />
      <Navbar onInschrijfClick={onInschrijfClick} />
      <main className="flex-grow relative">
        <Outlet />
        {children}
      </main>
      <Footer onInschrijfClick={onInschrijfClick} />
    </div>
  );
};

export default Layout; 