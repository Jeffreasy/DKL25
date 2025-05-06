import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { Sponsor } from '../components/sponsors/types'; // Import Sponsor type

interface ModalContextType {
  isDonatieOpen: boolean;
  openDonatieModal: () => void;
  closeDonatieModal: () => void;
  // Add other modals state/handlers here later if this works
  isProgramOpen: boolean; // Re-adding for completeness, but we'll test Donatie first
  openProgramModal: (initialTab: string) => void;
  closeProgramModal: () => void;
  selectedInitialTab?: string;

  isContactOpen: boolean;
  openContactModal: () => void;
  closeContactModal: () => void;
  
  // Add SponsorModal state/handlers
  isSponsorModalOpen: boolean;
  openSponsorModal: (sponsor: Sponsor) => void; // Use Sponsor type
  closeSponsorModal: () => void;
  selectedSponsor: Sponsor | null; // Use Sponsor type
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDonatieOpen, setIsDonatieOpen] = useState(false);
  const [isProgramOpen, setIsProgramOpen] = useState(false);
  const [selectedInitialTab, setSelectedInitialTab] = useState<string | undefined>(undefined);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null); // Use Sponsor type

  const openDonatieModal = useCallback(() => {
    // console.log("Context: Opening Donatie Modal"); // Removed log
    setIsDonatieOpen(true);
  }, []);

  const closeDonatieModal = useCallback(() => {
    // console.log("Context: Closing Donatie Modal"); // Removed log
    setIsDonatieOpen(false);
  }, []);

  const openProgramModal = useCallback((initialTab: string) => {
    // console.log("Context: Opening Program Modal with tab:", initialTab); // Removed log
    setSelectedInitialTab(initialTab);
    setIsProgramOpen(true);
  }, []);

  const closeProgramModal = useCallback(() => {
    // console.log("Context: Closing Program Modal"); // Removed log
    setIsProgramOpen(false);
  }, []);

  const openContactModal = useCallback(() => {
    // console.log("Context: Opening Contact Modal"); // Removed log
    if (isProgramOpen) { // Close program if opening contact from it
        setIsProgramOpen(false);
    }
    setIsContactOpen(true);
  }, [isProgramOpen]);

  const closeContactModal = useCallback(() => {
    // console.log("Context: Closing Contact Modal"); // Removed log
    setIsContactOpen(false);
  }, []);
  
  const openSponsorModal = useCallback((sponsor: Sponsor) => { // Use Sponsor type
    // console.log("Context: Opening Sponsor Modal for:", sponsor?.name); // Removed log
    setSelectedSponsor(sponsor);
    setIsSponsorModalOpen(true);
  }, []);

  const closeSponsorModal = useCallback(() => {
    // console.log("Context: Closing Sponsor Modal"); // Removed log
    setIsSponsorModalOpen(false);
    setSelectedSponsor(null); // Clear sponsor on close
  }, []);


  const value = {
    isDonatieOpen,
    openDonatieModal,
    closeDonatieModal,
    isProgramOpen,
    openProgramModal,
    closeProgramModal,
    selectedInitialTab,
    isContactOpen,
    openContactModal,
    closeContactModal,
    isSponsorModalOpen,
    openSponsorModal,
    closeSponsorModal,
    selectedSponsor
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}; 