import React, { memo, useMemo } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import ScrollToTopButton from './components/common/ScrollToTopButton';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { initGA } from './utils/googleAnalytics';
import { useUnderConstruction } from './hooks/useUnderConstruction';
import { usePerformanceTracking } from './hooks/usePerformanceTracking';
import OnderConstructie from './components/common/OnderConstructie';
import NormalApp from './components/NormalApp';
import LoadingScreen from './components/common/LoadingScreen';

// Initialize Google Analytics
initGA(import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX');

const App: React.FC = memo(() => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('App');

  const { data, loading, error } = useUnderConstruction();

  // Memoize the conditional rendering logic
  const appContent = useMemo(() => {
    if (loading) {
      trackInteraction('loading_screen', 'under_construction_check');
      return <LoadingScreen />;
    }

    // No error handling needed - hook provides fallback data

    // Als under construction actief is, toon alleen die pagina
    if (data?.is_active) {
      trackInteraction('under_construction_mode', 'active');
      return <OnderConstructie />;
    }

    // Anders toon de normale website
    trackInteraction('normal_mode', 'active');
    return (
      <Router>
        <NormalApp />
      </Router>
    );
  }, [data?.is_active, loading, trackInteraction]);

  return appContent;
});

App.displayName = 'App';

const AppWrapper: React.FC = memo(() => {
  return (
    <>
      <Toaster />
      <HelmetProvider>
        <App />
        <ScrollToTopButton />
        <Analytics />
      </HelmetProvider>
    </>
  );
});

AppWrapper.displayName = 'AppWrapper';

export default AppWrapper;