import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import ScrollToTopButton from './components/common/ScrollToTopButton';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { initGA } from './utils/googleAnalytics';
import { useUnderConstruction } from './hooks/useUnderConstruction';
import OnderConstructie from './components/common/OnderConstructie';
import NormalApp from './components/NormalApp';
import LoadingScreen from './components/common/LoadingScreen';

// Initialize Google Analytics
initGA(import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX');

function App() {
  const { data, loading, error } = useUnderConstruction();

  if (loading) {
    return <LoadingScreen />;
  }

  // No error handling needed - hook provides fallback data

  // Als under construction actief is, toon alleen die pagina
  if (data?.is_active) {
    return <OnderConstructie />;
  }

  // Anders toon de normale website
  return (
    <Router>
      <NormalApp />
    </Router>
  );
}

export default function AppWrapper() {
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
}