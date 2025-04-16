import React from 'react';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { motion } from 'framer-motion';

interface TriggerProps {
  onOpenModal: () => void;
}

// Define variants for animation
const buttonVariants = {
  rest: {
    width: '3rem', // 48px
    scale: 1,
  },
  hover: {
    width: '130px',
    scale: 1.02,
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 20,
      // When button variant changes to hover, stagger children
      staggerChildren: 0.05
    }
  }
};

const spanVariants = {
  rest: {
    opacity: 0,
    x: -10, // Start slightly to the left
    transition: { duration: 0.1 }
  },
  hover: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, delay: 0.1 } // Fade in slightly after expansion starts
  }
};

// Desktop specific trigger component using variants
const DesktopTrigger: React.FC<TriggerProps> = ({ onOpenModal }) => {
  return (
    <motion.button
      onClick={onOpenModal}
      className={`
        fixed left-0 top-1/2 transform -translate-y-1/2 z-40 
        flex flex-row items-center 
        bg-primary hover:bg-primary-dark 
        h-12 px-3 rounded-r-full 
        shadow-lg 
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 
        transition-colors duration-300 ease-in-out /* Cleaned up potential duplicates */
        /* Removed w-12, hover:w-[...], group. Width controlled by variants */
      `}
      aria-label="Open Programma"
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.98 }} // Keep simple tap effect
      // Remove whileHover from here, handled by variants
    >
      <EventNoteIcon fontSize="medium" className="text-white flex-shrink-0" />
      <motion.span 
        variants={spanVariants}
        className="ml-2 whitespace-nowrap font-medium text-sm text-white"
        // Removed opacity/group-hover classes. Controlled by variants.
      >
        Programma
      </motion.span>
    </motion.button>
  );
};

export default DesktopTrigger;
