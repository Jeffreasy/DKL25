import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/home/Home';
import { OverOns, Contact, DKL } from './pages';
import { useState } from 'react';
import { InschrijfModal, DonatieModal } from './components/modals';

const AppContent: React.FC<{
  isInschrijfModalOpen: boolean;
  isDonatieModalOpen: boolean;
  onInschrijfClose: () => void;
  onDonatieClose: () => void;
  onInschrijfClick: () => void;
  onDonatieClick: () => void;
}> = ({
  isInschrijfModalOpen,
  isDonatieModalOpen,
  onInschrijfClose,
  onDonatieClose,
  onInschrijfClick,
  onDonatieClick
}) => (
  <>
    <Layout 
      onInschrijfClick={onInschrijfClick} 
      onDonatieClick={onDonatieClick}
    >
      <Route path="/" element={
        <Home 
          onInschrijfClick={onInschrijfClick}
          onDonatieClick={onDonatieClick}
        />
      } />
      <Route path="/over-ons" element={<OverOns />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<Contact />} />
      <Route path="/wat-is-de-koninklijkeloop" element={<DKL />} />
    </Layout>

    <InschrijfModal 
      isOpen={isInschrijfModalOpen}
      onClose={onInschrijfClose}
    />
    <DonatieModal 
      isOpen={isDonatieModalOpen}
      onClose={onDonatieClose}
    />
  </>
);

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
      <Route element={
        <AppContent 
          isInschrijfModalOpen={isInschrijfModalOpen}
          isDonatieModalOpen={isDonatieModalOpen}
          onInschrijfClose={() => setIsInschrijfModalOpen(false)}
          onDonatieClose={() => setIsDonatieModalOpen(false)}
          onInschrijfClick={handleInschrijfClick}
          onDonatieClick={handleDonatieClick}
        />
      }>
        <Route path="/" element={
          <Home 
            onInschrijfClick={handleInschrijfClick}
            onDonatieClick={handleDonatieClick}
          />
        } />
        <Route path="/over-ons" element={<OverOns />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Contact />} />
        <Route path="/wat-is-de-koninklijkeloop" element={<DKL />} />
      </Route>
    ),
    {
      future: {
        v7_normalizeFormMethod: true,
        v7_relativeSplatPath: true
      }
    }
  );

  return <RouterProvider router={router} />;
}
