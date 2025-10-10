import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { Sponsor } from '../features/sponsors/types';
import { usePerformanceTracking } from '../hooks/usePerformanceTracking';

interface ModalContextType {
  isDonatieModalOpen: boolean;
  setIsDonatieModalOpen: (open: boolean) => void;
  isProgramModalOpen: boolean;
  setIsProgramModalOpen: (open: boolean) => void;
  selectedInitialTab: string | null;
  setSelectedInitialTab: (tab: string | null) => void;
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
  isSponsorModalOpen: boolean;
  selectedSponsor: Sponsor | null;
  handleDonatieClick: () => void;
  handleCloseDonatieModal: () => void;
  handleOpenProgramModal: (initialTab: string) => void;
  handleCloseProgramModal: () => void;
  handleOpenContactModal: () => void;
  handleCloseContactModal: () => void;
  handleOpenSponsorModal: (sponsor: Sponsor) => void;
  handleCloseSponsorModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = React.memo(({ children }) => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('ModalProvider');

  const [isDonatieModalOpen, setIsDonatieModalOpen] = useState(false);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [selectedInitialTab, setSelectedInitialTab] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);

  // Memoized event handlers to prevent recreation
  const handleDonatieClick = useCallback(() => {
    trackInteraction('donatie_click');
    setIsDonatieModalOpen(true);
  }, [trackInteraction]);

  const handleCloseDonatieModal = useCallback(() => {
    trackInteraction('donatie_close');
    setIsDonatieModalOpen(false);
  }, [trackInteraction]);

  const handleOpenProgramModal = useCallback((initialTab: string) => {
    trackInteraction('program_open', initialTab);
    setSelectedInitialTab(initialTab);
    setIsProgramModalOpen(true);
  }, [trackInteraction]);

  const handleCloseProgramModal = useCallback(() => {
    trackInteraction('program_close');
    setIsProgramModalOpen(false);
  }, [trackInteraction]);

  const handleOpenContactModal = useCallback(() => {
    trackInteraction('contact_open');
    if (isProgramModalOpen) {
      setIsProgramModalOpen(false);
    }
    setIsContactModalOpen(true);
  }, [isProgramModalOpen, trackInteraction]);

  const handleCloseContactModal = useCallback(() => {
    trackInteraction('contact_close');
    setIsContactModalOpen(false);
  }, [trackInteraction]);

  const handleOpenSponsorModal = useCallback((sponsor: Sponsor) => {
    trackInteraction('sponsor_open', sponsor.name);
    setSelectedSponsor(sponsor);
    setIsSponsorModalOpen(true);
  }, [trackInteraction]);

  const handleCloseSponsorModal = useCallback(() => {
    trackInteraction('sponsor_close');
    setIsSponsorModalOpen(false);
    setSelectedSponsor(null);
  }, [trackInteraction]);

  // Memoize context value to prevent recreation on every render
  const value = useMemo(() => ({
    isDonatieModalOpen,
    setIsDonatieModalOpen,
    isProgramModalOpen,
    setIsProgramModalOpen,
    selectedInitialTab,
    setSelectedInitialTab,
    isContactModalOpen,
    setIsContactModalOpen,
    isSponsorModalOpen,
    selectedSponsor,
    handleDonatieClick,
    handleCloseDonatieModal,
    handleOpenProgramModal,
    handleCloseProgramModal,
    handleOpenContactModal,
    handleCloseContactModal,
    handleOpenSponsorModal,
    handleCloseSponsorModal,
  }), [
    isDonatieModalOpen,
    isProgramModalOpen,
    selectedInitialTab,
    isContactModalOpen,
    isSponsorModalOpen,
    selectedSponsor,
    handleDonatieClick,
    handleCloseDonatieModal,
    handleOpenProgramModal,
    handleCloseProgramModal,
    handleOpenContactModal,
    handleCloseContactModal,
    handleOpenSponsorModal,
    handleCloseSponsorModal,
  ]);

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
});

ModalProvider.displayName = 'ModalProvider';