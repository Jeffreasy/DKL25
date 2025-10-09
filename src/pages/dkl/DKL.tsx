import React, { useEffect } from 'react';
import RouteSection from './components/RouteSection';
import { trackEvent } from '@/utils/googleAnalytics';
import { SEO } from '../../components/common/SEO'; // Import SEO

const DKL: React.FC = () => {
  useEffect(() => {
    trackEvent('dkl', 'page_view', 'dkl_page');
  }, []);

  return (
    <>
      <SEO 
        title="Wat is De Koninklijke Loop (DKL)?" 
        description="Ontdek alles over De Koninklijke Loop (DKL): een uniek, toegankelijk wandelevenement waar mensen met een beperking lopen voor het goede doel in Apeldoorn."
        route="/wat-is-de-koninklijkeloop"
      />
      <div className="min-h-screen pt-20">
        <RouteSection />
      </div>
    </>
  );
};

export default DKL; 