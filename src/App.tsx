import { Suspense, lazy, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import ScrollToTopButton from './components/ScrollToTopButton';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import { initGA } from './utils/googleAnalytics';

// Initialize Google Analytics
initGA(import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX');

// Lazy load pages
const Home = lazy(() => import('./pages/home/Home'));
const OverOns = lazy(() => import('./pages/over-ons/OverOns'));
const Contact = lazy(() => import('./pages/contact/Contact'));
const DKL = lazy(() => import('./pages/dkl/DKL'));
const RadioPage = lazy(() => import('./pages/Mediapage/Media'));
const Aanmelden = lazy(() => import('./pages/Aanmelden/aanmelden'));
const Privacy = lazy(() => import('./pages/privacy/Privacy'));

// PageTracker component to track route changes
const PageTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    import('./utils/googleAnalytics').then(({ logPageView }) => {
      logPageView(location.pathname);
    });
  }, [location]);

  return null;
};

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        element={
          <>
            <PageTracker />
            <Layout />
          </>
        }
      >
        <Route 
          path="/" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Home />
            </Suspense>
          } 
        />
        <Route path="/over-ons" element={<Suspense fallback={<LoadingScreen />}><OverOns /></Suspense>} />
        <Route path="/contact" element={<Suspense fallback={<LoadingScreen />}><Contact /></Suspense>} />
        <Route path="/faq" element={<Suspense fallback={<LoadingScreen />}><Contact /></Suspense>} />
        <Route path="/wat-is-de-koninklijkeloop" element={<Suspense fallback={<LoadingScreen />}><DKL /></Suspense>} />
        <Route path="/media" element={<Suspense fallback={<LoadingScreen />}><ErrorBoundary><RadioPage /></ErrorBoundary></Suspense>} />
        <Route path="/aanmelden" element={<Suspense fallback={<LoadingScreen />}><ErrorBoundary><Aanmelden /></ErrorBoundary></Suspense>} />
        <Route path="/privacy" element={<Suspense fallback={<LoadingScreen />}><ErrorBoundary><Privacy /></ErrorBoundary></Suspense>} />
      </Route>
    ),
    {
      future: {
        // @ts-ignore
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }
    }
  );

  return (
    <>
      <Toaster />
      <HelmetProvider>
        <RouterProvider router={router} />
        <ScrollToTopButton />
        <Analytics />
      </HelmetProvider>
    </>
  );
}