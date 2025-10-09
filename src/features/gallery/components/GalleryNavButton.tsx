import React from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface NavigationButtonProps {
  direction: 'previous' | 'next';
  onClick: () => void;
  disabled?: boolean;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({ 
  direction, 
  onClick,
  disabled = false 
}) => {
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
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        disabled:hover:bg-white/90 disabled:hover:shadow-lg
      `}
      onClick={onClick}
      disabled={disabled}
      aria-label={`${direction === 'previous' ? 'Vorige' : 'Volgende'} foto`}
      aria-disabled={disabled}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      <Icon 
        className={`
          text-gray-700 text-2xl sm:text-3xl
          transition-transform duration-300
          ${!disabled && (
            direction === 'previous' 
              ? 'group-hover:-translate-x-0.5' 
              : 'group-hover:translate-x-0.5'
          )}
          ${disabled ? 'text-gray-400' : ''}
        `}
      />
    </button>
  );
};

export default React.memo(NavigationButton); 