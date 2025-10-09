import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { trackEvent } from '@/utils/googleAnalytics';
import NavIcon from './NavIcon';
import type { NavItemProps } from './types';
import { cc, cn, animations } from '@/styles/shared';

const NavItem = memo<NavItemProps>(({ to, icon, children, onClick, className = '', isActive = false }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      if (!to) e.preventDefault();
      onClick();
    }
    try {
      trackEvent('navbar', 'navigation_click', children as string);
    } catch (error) {
      console.error('Error tracking navigation click:', error);
      // Sentry.captureException(error);
    }
  };

  const animationClass = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? '' : animations.fadeIn;
  const transformStyles = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? '' : 'translate-x-1';

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
          isActive ? cn('text-white', transformStyles) : 'text-white/80'
        )}
      >
        {children}
      </span>
    </>
  );

  return (
    <li className={animationClass}>
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