import React from 'react';
import AboutHeader from './components/AboutHeader';
import AboutImage from './components/AboutImage';
import ContentGrid from './components/ContentGrid';
import { SEO } from '../../components/SEO';

const OverOns: React.FC = () => {
  return (
    <>
      <SEO 
        title="Over Ons"
        description="Leer meer over de organisatie achter De Koninklijke Loop en ontdek onze missie om mensen met een beperking een onvergetelijke dag te bezorgen."
        route="/over-ons"
      />
      <div className="min-h-screen pt-20 bg-white">
        <div className="w-full max-w-[1400px] mx-auto px-6 py-12 font-roboto antialiased">
          <AboutHeader />
          <AboutImage />
          <ContentGrid />
        </div>
      </div>
    </>
  );
};

export default OverOns; 