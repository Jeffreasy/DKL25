import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/home/Home';
import { OverOns, Contact, DKL } from './pages';
import { useState } from 'react';
import { InschrijfModal, DonatieModal } from './components/modals';
import ScrollToTop from './components/ScrollToTop';

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
            <Home 
              onInschrijfClick={handleInschrijfClick}
              onDonatieClick={handleDonatieClick}
            />
          } 
        />
        <Route path="/over-ons" element={<OverOns />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Contact />} />
        <Route path="/wat-is-de-koninklijkeloop" element={<DKL />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}
