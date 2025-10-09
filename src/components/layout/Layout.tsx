import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import { Footer } from './Footer';
import { DonatieModal, ContactModal, SponsorModal } from '../ui/modals';
import ProgramModal from '../../features/program/components/ProgramModal';
import { useModal } from '../../contexts/ModalContext';
import ProgramSidebarTrigger from '../../features/program/components/SidebarTrigger';
import AIChatButton from '../ui/AIChatButton/AIChatButton';
import { cn, colors } from '@/styles/shared';

const Layout: React.FC = () => {
  const {
    isDonatieModalOpen,
    isProgramModalOpen,
    selectedInitialTab,
    isContactModalOpen,
    isSponsorModalOpen,
    selectedSponsor,
    handleCloseDonatieModal,
    handleCloseProgramModal,
    handleOpenContactModal,
    handleCloseContactModal,
    handleOpenProgramModal,
    handleCloseSponsorModal,
  } = useModal();

  return (
    <div className={cn('min-h-screen flex flex-col', colors.neutral.white)}>
      <Navbar />
      <main className="flex-grow relative">
        <Outlet />
      </main>
      <Footer />
      <DonatieModal
        isOpen={isDonatieModalOpen}
        onClose={handleCloseDonatieModal}
      />
      <ProgramModal
        isOpen={isProgramModalOpen}
        onClose={handleCloseProgramModal}
        initialTab={selectedInitialTab || undefined}
        onOpenContactModal={handleOpenContactModal}
      />
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={handleCloseContactModal}
      />
      <SponsorModal
        isOpen={isSponsorModalOpen}
        onClose={handleCloseSponsorModal}
        sponsor={selectedSponsor}
      />
      <ProgramSidebarTrigger onOpenModal={() => handleOpenProgramModal('Start/Finish/Feest')} />
      <AIChatButton />
    </div>
  );
};

export default Layout; 