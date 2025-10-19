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
    <aside className={cn('fixed bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 w-full mx-auto px-4', cc.zIndex.modal)} aria-label="Vaste actieknoppen">
      <nav className={cn(cc.flex.center, 'gap-2 sm:gap-4', className)} aria-label="Primaire acties">
        <button
          onClick={handleInschrijfClick}
          className={cn(
            cc.flex.center,
            'gap-1 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4',
            colors.primary.bg,
            colors.primary.hover,
            'text-white',
            cc.border.circle,
            cc.transition.base,
            'hover:-translate-y-0.5',
            cc.shadow.lg,
            colors.primary.focusRing,
            cc.text.body
          )}
          aria-label="Aanmelden voor DKL 2026"
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
            'text-white',
            cc.border.circle,
            cc.transition.base,
            'hover:-translate-y-0.5',
            cc.shadow.lg,
            colors.primary.focusRing,
            cc.text.body
          )}
          aria-label="Doneren aan DKL - Het Liliane Fonds"
        >
          <FavoriteIcon sx={{ fontSize: { xs: 14, sm: 16 } }} aria-hidden="true" />
          <span>Doneren</span>
        </button>
      </nav>
    </aside>
  );
});

InschDoneerButton.displayName = 'InschDoneerButton';

export default InschDoneerButton;