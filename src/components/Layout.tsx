import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import { Footer } from './footer';

interface LayoutProps {
  onInschrijfClick: () => void;
  onDonatieClick: () => void;
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ onInschrijfClick, onDonatieClick, children }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <Navbar onInschrijfClick={onInschrijfClick} />
      {children || <Outlet context={{ onInschrijfClick, onDonatieClick }} />}
      <Footer onInschrijfClick={onInschrijfClick} />
    </div>
  );
};

export default Layout; 