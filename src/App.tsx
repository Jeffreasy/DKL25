import React, { memo, useMemo } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import ScrollToTopButton from './components/common/ScrollToTopButton';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { initGA } from './utils/googleAnalytics';
import { useUnderConstruction } from './hooks/useUnderConstruction';
import { usePerformanceTracking } from './hooks/usePerformanceTracking';
import UnderConstruction from './components/common/UnderConstruction';
import NormalApp from './components/NormalApp';
import LoadingScreen from './components/common/LoadingScreen';
import { AuthProvider } from './contexts/AuthContext';
import { PermissionProvider } from './contexts/PermissionContext';

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

    // If under construction is active, show under construction page
    if (data?.is_active) {
      trackInteraction('under_construction_mode', 'active');
      return <UnderConstruction />;
    }

    // If there's an error fetching under-construction data, default to normal mode
    // This prevents showing under-construction when API is down
    if (error || !data) {
      trackInteraction('fallback_normal_mode', 'api_error');
      return (
        <Router>
          <AuthProvider>
            <PermissionProvider>
              <NormalApp />
            </PermissionProvider>
          </AuthProvider>
        </Router>
      );
    }

    // Otherwise show the normal website
    trackInteraction('normal_mode', 'active');
    return (
      <Router>
        <AuthProvider>
          <PermissionProvider>
            <NormalApp />
          </PermissionProvider>
        </AuthProvider>
      </Router>
    );
  }, [data, loading, error, trackInteraction]);

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
        <SpeedInsights />
      </HelmetProvider>
    </>
  );
});

AppWrapper.displayName = 'AppWrapper';

export default AppWrapper;