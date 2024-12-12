import React from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface NavigationButtonProps {
  direction: 'previous' | 'next';
  onClick: () => void;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({ direction, onClick }) => {
  const Icon = direction === 'previous' ? ChevronLeftIcon : ChevronRightIcon;
  
  return (
    <button
      className={`
        flex items-center justify-center
        w-10 h-10 sm:w-12 sm:h-12
        bg-white/90 hover:bg-white
        rounded-full
        shadow-lg hover:shadow-xl
        transition-all duration-300
        group
      `}
      onClick={onClick}
      aria-label={direction === 'previous' ? 'Vorige foto' : 'Volgende foto'}
    >
      <Icon 
        className={`
          text-gray-700 text-2xl sm:text-3xl
          transition-transform duration-300
          ${direction === 'previous' 
            ? 'group-hover:-translate-x-0.5' 
            : 'group-hover:translate-x-0.5'
          }
        `}
      />
    </button>
  );
};

export default NavigationButton; 