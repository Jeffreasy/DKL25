import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import { Footer } from './footer';
import InschDoneerButton from './inschrijfdonatebutton/inschdoneerbutton';
import { DonatieModal } from './modals';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const [isDonatieModalOpen, setIsDonatieModalOpen] = useState(false);

  const handleInschrijven = () => {
    navigate('/aanmelden');
  };

  const handleDonatie = () => {
    setIsDonatieModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow relative">
        <Outlet />
        <InschDoneerButton 
          onInschrijfClick={handleInschrijven}
          onDonatieClick={handleDonatie}
        />
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