import React, { useState, useCallback, memo, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { throttle } from 'lodash';
import { trackEvent } from '@/utils/googleAnalytics';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import NavItem from './NavItem';
import MobileMenu from './MobileMenu';
import { NAV_ITEMS, DEFAULT_LOGO } from './constants';
import type { NavbarProps } from './types';
import { cc, cn, colors, animations } from '@/styles/shared';

const Navbar = memo<NavbarProps>(({ className = '', showSocials = true, customLogo, onNavigate }) => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('Navbar');

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Memoize accessibility preferences to prevent recalculation
  const accessibilityPrefs = useMemo(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    trackInteraction('accessibility_check', prefersReducedMotion ? 'reduced_motion' : 'normal_motion');
    return {
      prefersReducedMotion,
      animationClass: prefersReducedMotion ? '' : animations.fadeIn,
      transformStyles: prefersReducedMotion ? '' : 'group-hover:scale-105',
      shineAnimation: prefersReducedMotion ? '' : animations.shine
    };
  }, [trackInteraction]);

  // Memoize scroll handler with useCallback
  const handleScroll = useCallback(throttle(() => {
    const shouldBeScrolled = window.scrollY > 20;
    if (isScrolled !== shouldBeScrolled) {
      setIsScrolled(shouldBeScrolled);
    }
  }, 100), [isScrolled]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);


  const isPathActive = useCallback(
    (path: string) => {
      if (path === '/') {
        return location.pathname === path;
      }
      return location.pathname.startsWith(path);
    },
    [location.pathname]
  );

  const navbarClasses = useMemo(
    () =>
      cn(
        'fixed top-0 left-0 right-0 h-20',
        cc.zIndex.fixed,
        colors.primary.bg,
        isScrolled && cc.shadow.lg,
        cc.typography.heading,
        cc.transition.base,
        className
      ),
    [isScrolled, className]
  );

  // Enhanced event handlers with performance tracking
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => {
      const newState = !prev;
      trackEvent('navbar', newState ? 'menu_open' : 'menu_close');
      trackInteraction('menu_toggle', newState ? 'open' : 'close');
      return newState;
    });
  }, [trackInteraction]);

  const handleNavigation = useCallback(
    (path: string) => {
      onNavigate?.(path);
      trackInteraction('navigation', path);
      if (isMenuOpen) {
        toggleMenu();
      }
    },
    [onNavigate, isMenuOpen, toggleMenu, trackInteraction]
  );

  return (
    <>
      <nav className={navbarClasses} role="navigation" aria-label="Hoofdnavigatie">
        <div className={cn(cc.container.wide, 'h-full')}>
          <div className={cn(cc.flex.between, 'h-full')}>
            <div className="flex-shrink-0 relative overflow-hidden rounded-lg group p-1">
              <Link to="/" className="block relative" aria-label="Home" onClick={() => handleNavigation('/')}>
                <img
                  src={customLogo || DEFAULT_LOGO}
                  alt="De Koninklijke Loop logo"
                  className={cn('h-16 w-auto relative', cc.zIndex.dropdown, cc.transition.transform, accessibilityPrefs.transformStyles)}
                  loading="lazy"
                  width={64}
                  height={64}
                />
                <div
                  className={cn(
                    'absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent',
                    accessibilityPrefs.shineAnimation
                  )}
                />
              </Link>
            </div>

            <div className={cn('hidden lg:flex lg:items-center lg:justify-center lg:flex-1', accessibilityPrefs.animationClass)}>
              <ul className="flex items-center space-x-4">
                {NAV_ITEMS.map((item) => (
                  <NavItem
                    key={item.to}
                    {...item}
                    isActive={item.to ? isPathActive(item.to) : false}
                    onClick={() => item.to && handleNavigation(item.to)}
                  />
                ))}
              </ul>
            </div>

            <button
              className={cn('lg:hidden p-3 rounded-lg text-white', colors.primary.hover, cc.transition.colors, colors.primary.focusRing)}
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Menu sluiten' : 'Menu openen'}
            >
              <MenuIcon sx={{ fontSize: 28 }} />
            </button>
          </div>
        </div>

        <MobileMenu isOpen={isMenuOpen} onClose={toggleMenu} />
      </nav>
      <div className="h-20" aria-hidden="true" />
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;