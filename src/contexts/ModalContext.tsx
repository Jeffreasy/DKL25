import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  isDonatieModalOpen: boolean;
  setIsDonatieModalOpen: (open: boolean) => void;
  isProgramModalOpen: boolean;
  setIsProgramModalOpen: (open: boolean) => void;
  selectedInitialTab: string | undefined;
  setSelectedInitialTab: (tab: string | undefined) => void;
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
  handleDonatieClick: () => void;
  handleOpenProgramModal: (initialTab: string) => void;
  handleCloseProgramModal: () => void;
  handleOpenContactModal: () => void;
  handleCloseContactModal: () => void;
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

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isDonatieModalOpen, setIsDonatieModalOpen] = useState(false);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [selectedInitialTab, setSelectedInitialTab] = useState<string | undefined>(undefined);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleDonatieClick = () => {
    setIsDonatieModalOpen(true);
  };

  const handleOpenProgramModal = (initialTab: string) => {
    setSelectedInitialTab(initialTab);
    setIsProgramModalOpen(true);
  };

  const handleCloseProgramModal = () => {
    setIsProgramModalOpen(false);
  };

  const handleOpenContactModal = () => {
    if (isProgramModalOpen) {
      setIsProgramModalOpen(false);
    }
    setIsContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
  };

  const value = {
    isDonatieModalOpen,
    setIsDonatieModalOpen,
    isProgramModalOpen,
    setIsProgramModalOpen,
    selectedInitialTab,
    setSelectedInitialTab,
    isContactModalOpen,
    setIsContactModalOpen,
    handleDonatieClick,
    handleOpenProgramModal,
    handleCloseProgramModal,
    handleOpenContactModal,
    handleCloseContactModal,
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};