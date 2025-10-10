import React, { useCallback, memo } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmailIcon from '@mui/icons-material/Email';
import { trackEvent } from '@/utils/googleAnalytics';
import { useModal } from '@/contexts/ModalContext';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import { cc, cn, colors } from '@/styles/shared';

interface InschDoneerButtonProps {
  onInschrijfClick: () => void;
  className?: string;
  isModalOpen?: boolean;
}

const InschDoneerButton: React.FC<InschDoneerButtonProps> = memo(({
  onInschrijfClick,
  className = '',
  isModalOpen = false
}) => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('InschDoneerButton');

  const { handleDonatieClick } = useModal();

  if (isModalOpen) {
    return null;
  }

  const handleInschrijfClick = useCallback(() => {
    trackInteraction('aanmelden_click');
    onInschrijfClick();
  }, [trackInteraction, onInschrijfClick]);

  const handleDonatieClickInternal = useCallback(() => {
    console.log("InschDoneerButton: Triggering openDonatieModal from context");
    trackInteraction('doneren_click');
    handleDonatieClick();
  }, [trackInteraction, handleDonatieClick]);

  return (
    <div className={cn('fixed bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 w-full mx-auto px-4', cc.zIndex.modal)}>
      <div className={cn(cc.flex.center, 'gap-2 sm:gap-4', className)}>
        <button
          onClick={handleInschrijfClick}
          className={cn(
            cc.flex.center,
            'gap-1 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4',
            colors.primary.bg,
            colors.primary.hover,
            'text-white font-semibold',
            cc.border.circle,
            cc.transition.base,
            'hover:-translate-y-0.5',
            cc.shadow.lg,
            colors.primary.focusRing,
            'text-sm sm:text-base'
          )}
          aria-label="Aanmelden voor het evenement"
        >
          <EmailIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
          <span>Aanmelden</span>
        </button>
        <button
          onClick={handleDonatieClickInternal}
          className={cn(
            cc.flex.center,
            'gap-1 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4',
            colors.primary.bg,
            colors.primary.hover,
            'text-white font-semibold',
            cc.border.circle,
            cc.transition.base,
            'hover:-translate-y-0.5',
            cc.shadow.lg,
            colors.primary.focusRing,
            'text-sm sm:text-base'
          )}
          aria-label="Doneren aan het goede doel"
        >
          <FavoriteIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
          <span>Doneren</span>
        </button>
      </div>
    </div>
  );
});

InschDoneerButton.displayName = 'InschDoneerButton';

export default InschDoneerButton;