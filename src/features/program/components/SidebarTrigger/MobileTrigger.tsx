import React from 'react';
import { motion } from 'framer-motion';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { cc, cn, colors } from '@/styles/shared';

interface TriggerProps {
  onOpenModal: () => void;
}

// Mobile specific trigger component (Corrected Padding)
const MobileTrigger: React.FC<TriggerProps> = ({ onOpenModal }) => {
  return (
    <motion.button
      onClick={onOpenModal}
      className={cn(
        'fixed left-0 top-1/2 transform -translate-y-1/2',
        cc.zIndex.fixed,
        cc.flex.center,
        colors.primary.bg,
        'text-white w-12 h-12 p-3 rounded-r-lg',
        cc.shadow.lg,
        colors.primary.focusRing,
        cc.transition.colors
      )}
      aria-label="Open Programma"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5, type: 'spring' as const, stiffness: 100 }}
      whileTap={{ scale: 0.98 }}
    >
      <EventNoteIcon fontSize="medium" />
    </motion.button>
  );
};

export default MobileTrigger;