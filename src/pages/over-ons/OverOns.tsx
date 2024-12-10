import React from 'react';
import AboutHeader from './components/AboutHeader';
import AboutImage from './components/AboutImage';
import ContentGrid from './components/ContentGrid';

const OverOns: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-6 py-12 font-roboto antialiased">
        <AboutHeader />
        <AboutImage />
        <ContentGrid />
      </div>
    </div>
  );
};

export default OverOns; 