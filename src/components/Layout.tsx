import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import { Footer } from './footer';
import { DonatieModal } from './modals';

interface LayoutProps {
  isDonatieModalOpen: boolean;
  onDonatieModalClose: () => void;
}

const Layout: React.FC<LayoutProps> = ({ isDonatieModalOpen, onDonatieModalClose }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow relative">
        <Outlet />
      </main>
      <Footer />
      <DonatieModal 
        isOpen={isDonatieModalOpen}
        onClose={onDonatieModalClose}
      />
    </div>
  );
};

export default Layout; 