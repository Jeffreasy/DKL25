import React, { memo, useMemo } from 'react';
import { CircularProgress } from '@mui/material';
import { cc, cn, colors, animations } from '@/styles/shared';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';

interface LoadingScreenProps {
  title?: string;
  message?: string;
  color?: string;
  size?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = memo(({
  title = 'De Koninklijke Loop',
  message = 'Laden...',
  color = colors.primary.bg,
  size = 60,
}) => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('LoadingScreen');

  // Memoize media query check to prevent recalculation on every render
  const pulseClass = useMemo(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    trackInteraction('accessibility_check', prefersReducedMotion ? 'reduced_motion' : 'normal_motion');
    return prefersReducedMotion ? '' : animations.pulse;
  }, [trackInteraction]);

  // Memoize CircularProgress sx prop to prevent recreation
  const circularProgressSx = useMemo(() => ({
    color,
    width: `${size}px !important`,
    height: `${size}px !important`
  }), [color, size]);

  return (
    <div
      className={cn('fixed inset-0 bg-white', cc.zIndex.modal, cc.flex.center)}
      role="status"
      aria-live="polite"
    >
      <section className="text-center">
        <CircularProgress
          className={cn(cc.loading.spinner)}
          sx={circularProgressSx}
          aria-label={message}
        />
        <div className={cn('mt-4', cc.typography.heading)}>
          <h2 className={cn(cc.text.h3, colors.primary.text, pulseClass)}>
            {title}
          </h2>
          <p className={cn(cc.text.body, cc.text.muted, 'mt-2')}>
            {message}
          </p>
        </div>
      </section>
    </div>
  );
});

LoadingScreen.displayName = 'LoadingScreen';

export default LoadingScreen;