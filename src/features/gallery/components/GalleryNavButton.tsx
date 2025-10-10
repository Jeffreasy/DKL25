import React from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { cc, cn, colors } from '@/styles/shared';

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
  const Icon = direction === 'previous' ? ChevronLeft : ChevronRight;
  
  return (
    <button
      className={cn(
        cc.flex.center,
        'w-10 h-10 sm:w-12 sm:h-12',
        'bg-white/90 hover:bg-white',
        cc.border.circle,
        cc.shadow.lg,
        'hover:shadow-xl',
        cc.transition.base,
        'group',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        colors.primary.focusRing,
        'disabled:hover:bg-white/90 disabled:hover:shadow-lg'
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={`${direction === 'previous' ? 'Vorige' : 'Volgende'} foto`}
      aria-disabled={disabled}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      <Icon 
        className={cn(
          'text-gray-700 text-2xl sm:text-3xl',
          cc.transition.transform,
          !disabled && (
            direction === 'previous'
              ? 'group-hover:-translate-x-0.5'
              : 'group-hover:translate-x-0.5'
          ),
          disabled && 'text-gray-400'
        )}
      />
    </button>
  );
};

export default React.memo(NavigationButton); 