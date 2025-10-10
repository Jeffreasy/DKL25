import React, { useEffect, useRef, memo, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { trackEvent } from '@/utils/googleAnalytics';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import NavItem from './NavItem';
import SocialLink from './SocialLink';
import { NAV_ITEMS, SOCIAL_LINKS, DEFAULT_LOGO } from './constants';
import type { MobileMenuProps } from './types';
import { cc, cn, colors, animations } from '@/styles/shared';

const MobileMenu = memo<MobileMenuProps>(({ isOpen, onClose }) => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('MobileMenu');

  const menuRef = useRef<HTMLDivElement>(null);

  // Memoize accessibility preferences to prevent recalculation
  const accessibilityPrefs = useMemo(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    trackInteraction('accessibility_check', prefersReducedMotion ? 'reduced_motion' : 'normal_motion');
    return {
      animationClass: prefersReducedMotion ? '' : animations.slideInRight
    };
  }, [trackInteraction]);

  // Memoize event handlers with useCallback
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      onClose();
      trackInteraction('click_outside', 'menu_closed');
    }
  }, [onClose, trackInteraction]);

  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
      trackInteraction('escape_key', 'menu_closed');
    }
  }, [onClose, trackInteraction]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      trackEvent('navbar', 'mobile_menu_open');
      trackInteraction('menu_opened', 'focus_set');
      menuRef.current?.focus(); // Focus op menu bij openen
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleClickOutside, handleEscape, trackInteraction]);

  const handleNavigation = useCallback(() => {
    onClose();
    trackEvent('navbar', 'mobile_menu_close');
    trackInteraction('navigation', 'menu_closed');
  }, [onClose, trackInteraction]);

  if (!isOpen) return null;

  return (
    <div
      className={cn('fixed inset-0 bg-black/40 backdrop-blur-sm lg:hidden', cc.zIndex.fixed)}
      role="dialog"
      aria-modal="true"
      aria-label="Mobiel navigatiemenu"
    >
      <div
        ref={menuRef}
        className={cn('fixed right-0 top-0 w-[280px] h-full p-6 overflow-y-auto', colors.primary.bg, cc.shadow.xl, accessibilityPrefs.animationClass)}
        tabIndex={-1}
      >
        <div className={cn(cc.flex.between, 'mb-8')}>
          <Link to="/" className="block" onClick={handleNavigation} aria-label="Home">
            <img
              src={DEFAULT_LOGO}
              alt="De Koninklijke Loop logo"
              className="h-12 w-auto"
              loading="lazy"
              width={48}
              height={48}
            />
          </Link>
          <button
            onClick={onClose}
            className={cn('p-2 text-white rounded-full', colors.primary.hover, cc.transition.colors, colors.primary.focusRing)}
            aria-label="Sluit menu"
          >
            <CloseIcon sx={{ fontSize: 24 }} />
          </button>
        </div>

        <nav className="mb-8" aria-label="Mobiele navigatie">
          <ul className="space-y-4 w-full">
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.to} {...item} onClick={handleNavigation} />
            ))}
          </ul>
        </nav>

        <div className={cn('mt-auto pt-6', cc.divider.horizontal, 'border-white/20')}>
          <p className={cn(cc.text.small, 'text-white/90 font-medium mb-4 text-center')}>
            Volg ons
          </p>
          <div className="flex justify-center space-x-4">
            {SOCIAL_LINKS.map((link) => (
              <SocialLink key={link.href} {...link} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

MobileMenu.displayName = 'MobileMenu';

export default MobileMenu;