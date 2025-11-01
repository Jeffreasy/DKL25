/**
 * Gallery Navigation Button Component
 * Reusable navigation button for gallery with direction-based icons
 */

import React, { memo } from 'react';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
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
  const label = direction === 'previous' ? 'Vorige' : 'Volgende';
  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`${label} foto`}
      aria-disabled={disabled}
      className={cn(
        cc.flex.center,
        'w-10 h-10 sm:w-12 sm:h-12',
        'bg-white/90',
        cc.border.circle,
        cc.shadow.lg,
        cc.transition.base,
        'group',
        disabled
          ? cn(cc.button.disabled, 'shadow-lg')
          : cn(
              'hover:bg-white hover:shadow-xl',
              colors.primary.focusRing,
              'cursor-pointer'
            )
      )}
    >
      <Icon
        className={cn(
          'text-2xl sm:text-3xl',
          cc.transition.transform,
          disabled
            ? 'text-gray-400'
            : cn(
                'text-gray-700',
                direction === 'previous'
                  ? 'group-hover:-translate-x-0.5'
                  : 'group-hover:translate-x-0.5'
              )
        )}
        aria-hidden="true"
      />
    </button>
  );
};

NavigationButton.displayName = 'NavigationButton';

export default memo(NavigationButton);