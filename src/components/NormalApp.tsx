import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import LoadingScreen from './common/LoadingScreen';
import { ErrorBoundary } from './common/ErrorBoundary';
import { ModalProvider, useModal } from '../contexts/ModalContext';

// Lazy load pages
const Home = lazy(() => import('../pages/home/Home'));
const OverOns = lazy(() => import('../pages/over-ons/OverOns'));
const Contact = lazy(() => import('../pages/contact/Contact'));
const DKL = lazy(() => import('../pages/dkl/DKL'));
const RadioPage = lazy(() => import('../pages/Mediapage/Media'));
const Aanmelden = lazy(() => import('../pages/Aanmelden/aanmelden'));
const Privacy = lazy(() => import('../pages/privacy/Privacy'));
const OnderConstructie = lazy(() => import('../pages/onder-constructie/OnderConstructie'));

const NormalApp: React.FC = () => {
  return (
    <ModalProvider>
      <Routes>
        <Route element={<LayoutWrapper />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<LoadingScreen />}>
                <Home />
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
            path="/media"
            element={
              <Suspense fallback={<LoadingScreen />}>
                <ErrorBoundary>
                  <RadioPage />
                </ErrorBoundary>
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
          <Route
            path="/privacy"
            element={
              <Suspense fallback={<LoadingScreen />}>
                <ErrorBoundary>
                  <Privacy />
                </ErrorBoundary>
              </Suspense>
            }
          />
          <Route
            path="/onder-constructie"
            element={
              <Suspense fallback={<LoadingScreen />}>
                <OnderConstructie />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </ModalProvider>
  );
};

// Layout wrapper component that uses modal context
const LayoutWrapper: React.FC = () => {
  return <Layout />;
};

export default NormalApp;