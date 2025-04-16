import React from 'react';
import { motion } from 'framer-motion';

interface TriggerProps {
  onOpenModal: () => void;
}

// Tablet specific trigger component (Corrected Padding)
const TabletTrigger: React.FC<TriggerProps> = ({ onOpenModal }) => {
  const text = "Programma";

  return (
    <motion.button
      onClick={onOpenModal}
      className={`
        fixed left-0 top-1/2 transform -translate-y-1/2 z-40
        flex flex-col items-start justify-center
        bg-primary text-white
        w-10 h-auto py-2 pl-2 /* Adjusted width and padding */
        rounded-r-lg
        shadow-lg
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        transition-colors duration-300 ease-in-out
      `}
      aria-label="Open Programma"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5, type: 'spring', stiffness: 100 }}
      whileTap={{ scale: 0.98 }}
    >
      <span
        className="font-medium text-xs leading-none tracking-normal"
      >
        {text.split('').map((char, index) => (
          <React.Fragment key={index}>
            {char}
            {index < text.length - 1 && <br />}
          </React.Fragment>
        ))}
      </span>
    </motion.button>
  );
};

export default TabletTrigger;