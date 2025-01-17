import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import { useState } from 'react';
import { DonatieModal } from './components/modals';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import AIChatButton from './components/AIChatButton';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';

// Lazy load pages
const Home = lazy(() => import('./pages/home/Home'));
const OverOns = lazy(() => import('./pages/over-ons/OverOns'));
const Contact = lazy(() => import('./pages/contact/Contact'));
const DKL = lazy(() => import('./pages/dkl/DKL'));
const Aanmelden = lazy(() => import('./pages/Aanmelden/aanmelden'));

export default function App() {
  const [isDonatieModalOpen, setIsDonatieModalOpen] = useState(false);

  const handleDonatieClick = () => {
    setIsDonatieModalOpen(true);
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        element={
          <Layout />
        }
      >
        <Route 
          path="/" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Home 
                onDonatieClick={handleDonatieClick}
              />
            </Suspense>
          } 
        />
        <Route 
          path="/over-ons" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <OverOns />
            </Suspense>
          } 
        />
        <Route 
          path="/contact" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Contact />
            </Suspense>
          } 
        />
        <Route 
          path="/faq" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Contact />
            </Suspense>
          } 
        />
        <Route 
          path="/wat-is-de-koninklijkeloop" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <DKL />
            </Suspense>
          } 
        />
        <Route 
          path="/aanmelden" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <ErrorBoundary>
                <Aanmelden />
              </ErrorBoundary>
            </Suspense>
          } 
        />
      </Route>
    )
  );

  return (
    <>
      <Toaster />
      <HelmetProvider>
        <RouterProvider router={router} />
        <AIChatButton />
        <ScrollToTopButton />
        <Analytics />
      </HelmetProvider>
    </>
  );
}
