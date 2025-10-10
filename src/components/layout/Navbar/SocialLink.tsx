import React, { memo, useCallback, useMemo } from 'react';
import { trackEvent } from '@/utils/googleAnalytics';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import NavIcon from './NavIcon';
import type { SocialLinkProps } from './types';
import { cc, cn, colors } from '@/styles/shared';

const SocialLink = memo<SocialLinkProps>(({ href, icon, label, hoverColor = 'white.20' }) => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('SocialLink');

  // Memoize accessibility preferences to prevent recalculation
  const accessibilityPrefs = useMemo(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    trackInteraction('accessibility_check', prefersReducedMotion ? 'reduced_motion' : 'normal_motion');
    return {
      hoverStyles: prefersReducedMotion ? '' : 'hover:-translate-y-1',
      transformStyles: prefersReducedMotion ? '' : 'group-hover:scale-110'
    };
  }, [trackInteraction]);

  const handleClick = useCallback(() => {
    try {
      trackEvent('navbar', 'social_media_click', icon);
      trackInteraction('click', icon);
    } catch (error) {
      console.error('Error tracking social click:', error);
      // Sentry.captureException(error);
    }
  }, [icon, trackInteraction]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'w-10 h-10',
        cc.flex.center,
        cc.border.circle,
        'bg-white/10 text-white',
        hoverColor,
        cc.transition.base,
        accessibilityPrefs.hoverStyles,
        cc.shadow.lg,
        'group'
      )}
      onClick={handleClick}
      aria-label={label}
    >
      <NavIcon name={icon} className={cn(cc.transition.transform, accessibilityPrefs.transformStyles)} />
    </a>
  );
});

SocialLink.displayName = 'SocialLink';

export default SocialLink;