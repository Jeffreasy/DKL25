import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import { Footer } from './footer';
import { DonatieModal } from './modals';

const Layout: React.FC = () => {
  const [isDonatieModalOpen, setIsDonatieModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow relative">
        <Outlet />
      </main>
      <Footer />
      <DonatieModal 
        isOpen={isDonatieModalOpen}
        onClose={() => setIsDonatieModalOpen(false)}
      />
    </div>
  );
};

export default Layout; 