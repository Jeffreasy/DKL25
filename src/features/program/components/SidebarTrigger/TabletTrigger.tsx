import React from 'react';
import { motion } from 'framer-motion';
import { EventNote } from '@mui/icons-material';
import { cc, cn, colors } from '@/styles/shared';

interface TriggerProps {
  onOpenModal: () => void;
}

// Optimized shared trigger component for mobile/tablet
const SidebarTrigger: React.FC<TriggerProps & { delay?: number }> = ({ onOpenModal, delay = 0.5 }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpenModal();
    }
  };

  return (
    <motion.button
      onClick={onOpenModal}
      onKeyDown={handleKeyDown}
      className={cn(
        'fixed left-0 top-1/2 transform -translate-y-1/2',
        cc.zIndex.fixed,
        cc.flex.center,
        colors.primary.bg,
        'text-white w-12 h-12 p-3 rounded-r-lg',
        cc.shadow.lg,
        colors.primary.focusRing,
        cc.transition.colors,
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
      )}
      aria-label="Open programma overzicht"
      role="button"
      tabIndex={0}
      initial={{ x: -60, opacity: 0 }} // Reduced movement for performance
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }} // Simplified animation
      whileTap={{ scale: 0.95 }}
      whileFocus={{ scale: 1.05 }}
    >
      <EventNote fontSize="medium" />
    </motion.button>
  );
};

// Tablet specific trigger component
const TabletTrigger: React.FC<TriggerProps> = ({ onOpenModal }) => {
  return <SidebarTrigger onOpenModal={onOpenModal} delay={0.7} />;
};

export default TabletTrigger;