import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import { useState } from 'react';
import { InschrijfModal, DonatieModal } from './components/modals';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import AIChatButton from './components/AIChatButton';
import { HelmetProvider } from 'react-helmet-async';

// Lazy load pages
const Home = lazy(() => import('./pages/home/Home'));
const OverOns = lazy(() => import('./pages/over-ons/OverOns'));
const Contact = lazy(() => import('./pages/contact/Contact'));
const DKL = lazy(() => import('./pages/dkl/DKL'));
const Aanmelden = lazy(() => import('./pages/Aanmelden/aanmelden'));

export default function App() {
  const [isInschrijfModalOpen, setIsInschrijfModalOpen] = useState(false);
  const [isDonatieModalOpen, setIsDonatieModalOpen] = useState(false);

  const handleInschrijfClick = () => {
    setIsInschrijfModalOpen(true);
  };

  const handleDonatieClick = () => {
    setIsDonatieModalOpen(true);
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        element={
          <Layout onInschrijfClick={handleInschrijfClick}>
            <ScrollToTop />
            <InschrijfModal 
              isOpen={isInschrijfModalOpen}
              onClose={() => setIsInschrijfModalOpen(false)}
            />
            <DonatieModal 
              isOpen={isDonatieModalOpen}
              onClose={() => setIsDonatieModalOpen(false)}
            />
          </Layout>
        }
      >
        <Route 
          path="/" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Home 
                onInschrijfClick={handleInschrijfClick}
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
              <Contact onInschrijfClick={handleInschrijfClick} />
            </Suspense>
          } 
        />
        <Route 
          path="/faq" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Contact onInschrijfClick={handleInschrijfClick} />
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
              <Aanmelden />
            </Suspense>
          } 
        />
      </Route>
    )
  );

  return (
    <HelmetProvider>
      <RouterProvider router={router} />
      <AIChatButton />
      <ScrollToTopButton />
      <Analytics />
    </HelmetProvider>
  );
}
