import React, { memo } from 'react';
import { trackEvent } from '@/utils/googleAnalytics';
import NavIcon from './NavIcon';
import type { SocialLinkProps } from './types';
import { cc, cn, colors } from '@/styles/shared';

const SocialLink = memo<SocialLinkProps>(({ href, icon, label, hoverColor = 'white.20' }) => {
  const handleClick = () => {
    try {
      trackEvent('navbar', 'social_media_click', icon);
    } catch (error) {
      console.error('Error tracking social click:', error);
      // Sentry.captureException(error);
    }
  };

  const hoverStyles = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? '' : 'hover:-translate-y-1';
  const transformStyles = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? '' : 'group-hover:scale-110';

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
        hoverStyles,
        cc.shadow.lg,
        'group'
      )}
      onClick={handleClick}
      aria-label={label}
    >
      <NavIcon name={icon} className={cn(cc.transition.transform, transformStyles)} />
    </a>
  );
});

SocialLink.displayName = 'SocialLink';

export default SocialLink;