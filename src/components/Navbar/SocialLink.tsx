import React, { memo } from 'react';
import { trackEvent } from '@/utils/googleAnalytics';
import NavIcon from './NavIcon';
import type { SocialLinkProps } from './types';

const SocialLink = memo<SocialLinkProps>(({ href, icon, label, hoverColor = 'hover:bg-white/20' }) => {
  const handleClick = () => {
    try {
      trackEvent('navbar', 'social_media_click', icon);
    } catch (error) {
      console.error('Error tracking social click:', error);
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white ${hoverColor} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group`}
      onClick={handleClick}
      aria-label={label}
    >
      <NavIcon 
        name={icon} 
        className="transition-transform group-hover:scale-110"
      />
    </a>
  );
});

SocialLink.displayName = 'SocialLink';

export default SocialLink; 