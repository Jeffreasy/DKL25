import React, { useEffect } from 'react';
import RouteSection from './components/RouteSection';
import { trackEvent } from '@/utils/googleAnalytics';

const DKL: React.FC = () => {
  useEffect(() => {
    trackEvent('dkl', 'page_view', 'dkl_page');
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <RouteSection />
    </div>
  );
};

export default DKL; 