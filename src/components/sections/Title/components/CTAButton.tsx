import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { trackEvent } from '@/utils/googleAnalytics';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import { cc, cn, colors } from '@/styles/shared';

interface CTAButtonProps {
  onClick: () => void;
}

const CTAButton: React.FC<CTAButtonProps> = memo(({ onClick }) => {
  const { trackInteraction } = usePerformanceTracking('CTAButton');

  const handleClick = useCallback(() => {
    trackInteraction('register_click');
    trackEvent('title_section', 'register_click', 'register_button');
    onClick();
  }, [trackInteraction, onClick]);

  return (
    <motion.div
      className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <motion.button
        onClick={handleClick}
        className={cn(
          'text-white px-6 py-3 sm:px-8 sm:py-4 md:px-12 md:py-5',
          'w-full sm:w-auto',
          'font-body font-bold tracking-wide',
          'text-base sm:text-lg md:text-xl lg:text-2xl',
          colors.primary.bg,
          colors.primary.hover,
          cc.border.circle,
          cc.transition.base,
          'hover:-translate-y-1',
          cc.shadow.xl,
          cc.flex.center,
          'gap-3 sm:gap-4'
        )}
        aria-label="Schrijf je nu in voor De Koninklijke Loop"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>Schrijf je nu in</span>
        <ArrowForward sx={{ fontSize: { xs: 20, sm: 24, md: 28, lg: 32 } }} />
      </motion.button>
    </motion.div>
  );
});

CTAButton.displayName = 'CTAButton';

export default CTAButton;