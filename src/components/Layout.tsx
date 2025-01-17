import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import { Footer } from './footer';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 