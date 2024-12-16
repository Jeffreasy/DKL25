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
import { Inschrijving } from './pages';

// Lazy load pages met expliciete extensies
const Home = lazy(() => import('./pages/home/Home.tsx'));
const OverOns = lazy(() => import('./pages/over-ons/OverOns.tsx'));
const Contact = lazy(() => import('./pages/contact/Contact.tsx'));
const DKL = lazy(() => import('./pages/dkl/DKL.tsx'));

export default function App() {
  const [isDonatieModalOpen, setIsDonatieModalOpen] = useState(false);

  const handleDonatieClick = () => {
    setIsDonatieModalOpen(true);
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        element={
          <Layout>
            <ScrollToTop />
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
          path="/inschrijving" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Inschrijving />
            </Suspense>
          } 
        />
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
      <AIChatButton />
      <ScrollToTopButton />
      <Analytics />
    </>
  );
}
