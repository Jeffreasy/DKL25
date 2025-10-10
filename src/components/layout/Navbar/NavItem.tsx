import React, { memo, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { trackEvent } from '@/utils/googleAnalytics';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import NavIcon from './NavIcon';
import type { NavItemProps } from './types';
import { cc, cn, animations } from '@/styles/shared';

const NavItem = memo<NavItemProps>(({ to, icon, children, onClick, className = '', isActive = false }) => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('NavItem');

  // Memoize accessibility preferences to prevent recalculation
  const accessibilityPrefs = useMemo(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    trackInteraction('accessibility_check', prefersReducedMotion ? 'reduced_motion' : 'normal_motion');
    return {
      animationClass: prefersReducedMotion ? '' : animations.fadeIn,
      transformStyles: prefersReducedMotion ? '' : 'translate-x-1'
    };
  }, [trackInteraction]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (onClick) {
      if (!to) e.preventDefault();
      onClick();
    }
    try {
      trackEvent('navbar', 'navigation_click', children as string);
      trackInteraction('click', `${children}_${isActive ? 'active' : 'inactive'}`);
    } catch (error) {
      console.error('Error tracking navigation click:', error);
      // Sentry.captureException(error);
    }
  }, [onClick, to, children, isActive, trackInteraction]);

  const linkClasses = cn(
    cc.flex.start,
    'gap-2 px-3 py-2.5 text-white rounded-lg relative',
    cc.transition.base,
    isActive
      ? 'bg-white/10 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-white after:rounded-full'
      : cn('hover:bg-primary-dark/50', cc.shadow.md, 'active:bg-primary-dark', cc.shadow.lg),
    className
  );

  const content = (
    <>
      <NavIcon
        name={icon}
        size={24}
        className={cn(cc.transition.transform, isActive ? 'text-white scale-110' : 'text-white/80')}
      />
      <span
        className={cn(
          'font-medium text-base lg:text-lg whitespace-nowrap',
          cc.transition.base,
          isActive ? cn('text-white', accessibilityPrefs.transformStyles) : 'text-white/80'
        )}
      >
        {children}
      </span>
    </>
  );

  return (
    <li className={accessibilityPrefs.animationClass}>
      {to ? (
        <Link to={to} className={linkClasses} onClick={onClick ? handleClick : undefined} aria-current={isActive ? 'page' : undefined}>
          {content}
        </Link>
      ) : (
        <button onClick={handleClick} className={linkClasses} aria-pressed={isActive}>
          {content}
        </button>
      )}
    </li>
  );
});

NavItem.displayName = 'NavItem';

export default NavItem;