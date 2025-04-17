import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import { Footer } from './footer';
import { DonatieModal } from './modals';
import ProgramModal from './programma/components/ProgramModal';
import { ContactModal } from './modals/ContactModal';
import ProgramSidebarTrigger from './programma/components/SidebarTrigger';

interface LayoutProps {
  isDonatieModalOpen: boolean;
  onDonatieModalClose: () => void;
  isProgramModalOpen: boolean;
  onCloseProgramModal: () => void;
  selectedInitialTab?: string;
  onOpenContactModal: () => void;
  isContactModalOpen: boolean;
  onCloseContactModal: () => void;
  onOpenProgramModal: (initialTab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({
  isDonatieModalOpen,
  onDonatieModalClose,
  isProgramModalOpen,
  onCloseProgramModal,
  selectedInitialTab,
  onOpenContactModal,
  isContactModalOpen,
  onCloseContactModal,
  onOpenProgramModal
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow relative">
        <Outlet />
      </main>
      <Footer />
      <DonatieModal 
        isOpen={isDonatieModalOpen}
        onClose={onDonatieModalClose}
      />
      <ProgramModal 
        isOpen={isProgramModalOpen} 
        onClose={onCloseProgramModal} 
        initialTab={selectedInitialTab}
        onOpenContactModal={onOpenContactModal}
      />
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={onCloseContactModal}
      />
      <ProgramSidebarTrigger onOpenModal={() => onOpenProgramModal('Start/Finish/Feest')} />
    </div>
  );
};

export default Layout; 