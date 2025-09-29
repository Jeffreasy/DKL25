import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import { Footer } from './footer';
import { DonatieModal, ContactModal, SponsorModal } from './modals';
import ProgramModal from './programma/components/ProgramModal';
import { useModal } from '../contexts/ModalContext';
import ProgramSidebarTrigger from './programma/components/SidebarTrigger';
import AIChatButton from './AIChatButton/AIChatButton';

const Layout: React.FC = () => {
  const {
    isDonatieModalOpen,
    isProgramModalOpen,
    selectedInitialTab,
    isContactModalOpen,
    handleCloseProgramModal,
    handleOpenContactModal,
    handleCloseContactModal,
    handleOpenProgramModal,
  } = useModal();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow relative">
        <Outlet />
      </main>
      <Footer />
      <DonatieModal
        isOpen={isDonatieModalOpen}
        onClose={() => {}}
      />
      <ProgramModal
        isOpen={isProgramModalOpen}
        onClose={handleCloseProgramModal}
        initialTab={selectedInitialTab}
        onOpenContactModal={handleOpenContactModal}
      />
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={handleCloseContactModal}
      />
      <ProgramSidebarTrigger onOpenModal={() => handleOpenProgramModal('Start/Finish/Feest')} />
      <AIChatButton />
    </div>
  );
};

export default Layout; 