import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import { Footer } from './footer';
import { DonatieModal, ContactModal, SponsorModal } from './modals';
import ProgramModal from './programma/components/ProgramModal';
import { useModal } from '../context/ModalContext';
import ProgramSidebarTrigger from './programma/components/SidebarTrigger';
import AIChatButton from './AIChatButton/AIChatButton';

const Layout: React.FC = () => {
  const {
    isDonatieOpen,
    closeDonatieModal,
    isProgramOpen,
    closeProgramModal,
    openProgramModal,
    selectedInitialTab,
    isContactOpen,
    closeContactModal,
    openContactModal,
    isSponsorModalOpen,
    closeSponsorModal,
    selectedSponsor
  } = useModal();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow relative">
        <Outlet />
      </main>
      <Footer />
      <DonatieModal 
        isOpen={isDonatieOpen}
        onClose={closeDonatieModal}
      />
      <ProgramModal 
        isOpen={isProgramOpen} 
        onClose={closeProgramModal} 
        initialTab={selectedInitialTab}
        onOpenContactModal={openContactModal}
      />
      <ContactModal
        isOpen={isContactOpen}
        onClose={closeContactModal}
      />
       <SponsorModal 
        isOpen={isSponsorModalOpen} 
        onClose={closeSponsorModal} 
        sponsor={selectedSponsor} 
      />
      <ProgramSidebarTrigger onOpenModal={() => openProgramModal('Start/Finish/Feest')} />
      <AIChatButton />
    </div>
  );
};

export default Layout; 