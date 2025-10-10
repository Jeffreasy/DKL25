import React, { memo, useCallback, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import { Footer } from './Footer';
import { DonatieModal, ContactModal, SponsorModal } from '../ui/modals';
import ProgramModal from '../../features/program/components/ProgramModal';
import { useModal } from '../../contexts/ModalContext';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import ProgramSidebarTrigger from '../../features/program/components/SidebarTrigger';
import AIChatButton from '../ui/AIChatButton/AIChatButton';
import { cn, colors } from '@/styles/shared';

const Layout: React.FC = memo(() => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('Layout');

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

  // Memoize modal props to prevent recreation
  const modalProps = useMemo(() => ({
    donatieModal: {
      isOpen: isDonatieModalOpen,
      onClose: handleCloseDonatieModal
    },
    programModal: {
      isOpen: isProgramModalOpen,
      onClose: handleCloseProgramModal,
      initialTab: selectedInitialTab || undefined,
      onOpenContactModal: handleOpenContactModal
    },
    contactModal: {
      isOpen: isContactModalOpen,
      onClose: handleCloseContactModal
    },
    sponsorModal: {
      isOpen: isSponsorModalOpen,
      onClose: handleCloseSponsorModal,
      sponsor: selectedSponsor
    }
  }), [
    isDonatieModalOpen, handleCloseDonatieModal,
    isProgramModalOpen, handleCloseProgramModal, selectedInitialTab, handleOpenContactModal,
    isContactModalOpen, handleCloseContactModal,
    isSponsorModalOpen, handleCloseSponsorModal, selectedSponsor
  ]);

  // Memoize event handlers
  const handleProgramSidebarTrigger = useCallback(() => {
    trackInteraction('program_sidebar_trigger', 'opened');
    handleOpenProgramModal('Start/Finish/Feest');
  }, [handleOpenProgramModal, trackInteraction]);

  return (
    <div className={cn('min-h-screen flex flex-col', colors.neutral.white)}>
      <Navbar />
      <main className="flex-grow relative">
        <Outlet />
      </main>
      <Footer />
      <DonatieModal {...modalProps.donatieModal} />
      <ProgramModal {...modalProps.programModal} />
      <ContactModal {...modalProps.contactModal} />
      <SponsorModal {...modalProps.sponsorModal} />
      <ProgramSidebarTrigger onOpenModal={handleProgramSidebarTrigger} />
      <AIChatButton />
    </div>
  );
});

Layout.displayName = 'Layout';

export default Layout;