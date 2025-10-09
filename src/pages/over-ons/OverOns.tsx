import React, { useEffect } from 'react';
import AboutHeader from './components/AboutHeader';
import AboutImage from './components/AboutImage';
import ContentGrid from './components/ContentGrid';
import { SEO } from '../../components/common/SEO';
import { trackEvent } from '@/utils/googleAnalytics';

const OverOns: React.FC = () => {
  useEffect(() => {
    trackEvent('over_ons', 'page_view', 'over_ons_page');
  }, []);

  return (
    <>
      <SEO 
        title="Over Ons | De Koninklijke Loop (DKL)"
        description="Leer meer over de organisatie achter De Koninklijke Loop (DKL), onze missie voor een toegankelijk wandelevenement en hoe we mensen met een beperking ondersteunen."
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