import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { cc, cn, colors, animations } from '@/styles/shared';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';

interface ScrollToTopButtonProps {
  scrollThreshold?: number;
  size?: 'small' | 'medium' | 'large';
  position?: { bottom: string; right: string };
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = memo(({
  scrollThreshold = 300,
  size = 'medium',
  position = { bottom: '4rem', right: '1rem' },
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('ScrollToTopButton');

  // Memoize accessibility preferences to prevent recalculation
  const accessibilityPrefs = useMemo(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    trackInteraction('accessibility_check', prefersReducedMotion ? 'reduced_motion' : 'normal_motion');
    return {
      prefersReducedMotion,
      animationClass: prefersReducedMotion ? '' : animations.fadeIn,
      hoverStyles: prefersReducedMotion ? '' : 'hover:-translate-y-1 hover:shadow-xl'
    };
  }, [trackInteraction]);

  // Memoize size styles to prevent recreation
  const sizeStyles = useMemo(() => ({
    small: { padding: 'p-2', fontSize: { xs: 20, sm: 24 } },
    medium: { padding: 'p-3', fontSize: { xs: 24, sm: 28 } },
    large: { padding: 'p-4', fontSize: { xs: 28, sm: 32 } },
  }), []);

  // Memoize scroll handler with useCallback
  const toggleVisibility = useCallback(debounce(() => {
    setIsVisible(window.scrollY > scrollThreshold);
  }, 100), [scrollThreshold]);

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [toggleVisibility]);

  // Memoize scroll to top function
  const scrollToTop = useCallback(() => {
    trackInteraction('scroll_to_top', 'button_clicked');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [trackInteraction]);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          role="button"
          title="Terug naar boven"
          aria-label="Scroll naar boven"
          style={{
            bottom: position.bottom,
            right: position.right,
          }}
          className={cn(
            'fixed',
            sizeStyles[size].padding,
            cc.zIndex.fixed,
            colors.primary.bg,
            colors.primary.hover,
            'text-white',
            cc.border.circle,
            cc.shadow.lg,
            cc.transition.base,
            accessibilityPrefs.hoverStyles,
            accessibilityPrefs.animationClass,
            colors.primary.focusRing
          )}
        >
          <KeyboardArrowUpIcon sx={{ fontSize: sizeStyles[size].fontSize }} />
        </button>
      )}
    </>
  );
});

ScrollToTopButton.displayName = 'ScrollToTopButton';

export default ScrollToTopButton;