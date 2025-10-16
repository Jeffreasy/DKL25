import React, { Suspense, lazy, memo, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';
import LoadingScreen from './common/LoadingScreen';
import ScrollToTop from './common/ScrollToTop';
import { ErrorBoundary } from './common/ErrorBoundary';
import { ModalProvider, useModal } from '../contexts/ModalContext';
import { usePerformanceTracking } from '../hooks/usePerformanceTracking';

// Lazy load pages with aggressive code splitting
const Home = lazy(() => import(/* webpackChunkName: "home" */ '../pages/home/Home'));
const OverOns = lazy(() => import(/* webpackChunkName: "about" */ '../pages/over-ons/OverOns'));
const Contact = lazy(() => import(/* webpackChunkName: "contact" */ '../pages/contact/Contact'));
const DKL = lazy(() => import(/* webpackChunkName: "dkl-info" */ '../pages/dkl/DKL'));
const RadioPage = lazy(() => import(/* webpackChunkName: "media" */ '../pages/Mediapage/Media'));
const Aanmelden = lazy(() => import(/* webpackChunkName: "registration" */ '../pages/Aanmelden/aanmelden'));
const Privacy = lazy(() => import(/* webpackChunkName: "privacy" */ '../pages/privacy/Privacy'));
const OnderConstructie = lazy(() => import(/* webpackChunkName: "maintenance" */ '../pages/onder-constructie/OnderConstructie'));

const NormalApp: React.FC = memo(() => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('NormalApp');

  // Memoize the routes configuration to prevent recreation
  const routesConfig = useMemo(() => [
    { path: '/', component: Home, trackName: 'home' },
    { path: '/over-ons', component: OverOns, trackName: 'over_ons' },
    { path: '/contact', component: Contact, trackName: 'contact' },
    { path: '/faq', component: Contact, trackName: 'faq' },
    { path: '/wat-is-de-koninklijkeloop', component: DKL, trackName: 'dkl_info' },
    { path: '/media', component: RadioPage, trackName: 'media', hasErrorBoundary: true },
    { path: '/aanmelden', component: Aanmelden, trackName: 'aanmelden', hasErrorBoundary: true },
    { path: '/privacy', component: Privacy, trackName: 'privacy', hasErrorBoundary: true },
    { path: '/onder-constructie', component: OnderConstructie, trackName: 'onder_constructie' },
    { path: '/sitemap.xml', component: () => null, trackName: 'sitemap' },
  ], []);

  return (
    <ModalProvider>
      <ScrollToTop />
      <Routes>
        <Route element={<LayoutWrapper />}>
          {/* Redirect /home to / */}
          <Route path="/home" element={<Navigate to="/" replace />} />
          
          {routesConfig.map(({ path, component: Component, trackName, hasErrorBoundary }) => (
            <Route
              key={path}
              path={path}
              element={
                path === '/sitemap.xml' ? (
                  <div></div>
                ) : (
                  <Suspense fallback={<LoadingScreen />}>
                    {hasErrorBoundary ? (
                      <ErrorBoundary>
                        <Component />
                      </ErrorBoundary>
                    ) : (
                      <Component />
                    )}
                  </Suspense>
                )
              }
            />
          ))}
        </Route>
      </Routes>
    </ModalProvider>
  );
});

NormalApp.displayName = 'NormalApp';

// Layout wrapper component that uses modal context
const LayoutWrapper: React.FC = memo(() => {
  return <Layout />;
});

LayoutWrapper.displayName = 'LayoutWrapper';

export default NormalApp;