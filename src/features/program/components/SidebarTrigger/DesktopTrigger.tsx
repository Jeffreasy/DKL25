import React, { memo } from 'react';
import EventNote from '@mui/icons-material/EventNote';
import { motion } from 'framer-motion';
import { cc, cn, colors } from '@/styles/shared';

interface TriggerProps {
  onOpenModal: () => void;
}

// Simplified animation variants for better performance
const buttonVariants = {
  rest: { width: '3rem', scale: 1 },
  hover: {
    width: '130px',
    scale: 1.02,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 25
    }
  }
};

const spanVariants = {
  rest: { opacity: 0, x: -10 },
  hover: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.15, delay: 0.05 }
  }
};

// Desktop specific trigger component using variants
const DesktopTrigger: React.FC<TriggerProps> = memo(({ onOpenModal }) => {
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
        'flex flex-row items-center',
        colors.primary.bg,
        colors.primary.hover,
        'h-12 px-3 rounded-r-full',
        cc.shadow.lg,
        colors.primary.focusRing,
        cc.transition.colors,
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
      )}
      aria-label="Open programma overzicht"
      role="button"
      tabIndex={0}
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      whileFocus={{ scale: 1.02 }}
    >
      <EventNote fontSize="medium" className="text-white flex-shrink-0" />
      <motion.span
        variants={spanVariants}
        className={cn('ml-2 whitespace-nowrap font-medium text-white', cc.text.small)}
      >
        Programma
      </motion.span>
    </motion.button>
  );
});

DesktopTrigger.displayName = 'DesktopTrigger';

export default DesktopTrigger;
