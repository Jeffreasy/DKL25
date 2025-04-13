import React, { useEffect } from 'react';
import RouteSection from './components/RouteSection';
import { trackEvent } from '@/utils/googleAnalytics';
import { SEO } from '../../components/SEO'; // Import SEO

const DKL: React.FC = () => {
  useEffect(() => {
    trackEvent('dkl', 'page_view', 'dkl_page');
  }, []);

  return (
    <>
      <SEO 
        title="Wat is De Koninklijke Loop?" 
        description="Ontdek alles over De Koninklijke Loop: een uniek evenement waar mensen met een beperking wandelen en hardlopen voor het goede doel in Apeldoorn."
        route="/wat-is-de-koninklijkeloop"
      />
      <div className="min-h-screen pt-20">
        <RouteSection />
      </div>
    </>
  );
};

export default DKL; 