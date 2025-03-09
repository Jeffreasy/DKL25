import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { trackEvent } from '@/utils/googleAnalytics';
import NavIcon from './NavIcon';
import type { NavItemProps } from './types';

const NavItem = memo<NavItemProps>(({ 
  to, 
  icon, 
  children, 
  onClick, 
  className = '',
  isActive = false 
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      if (!to) e.preventDefault();
      onClick();
    }
    trackEvent('navbar', 'navigation_click', children as string);
  };

  const baseClasses = "flex items-center gap-3 px-5 py-2.5 text-white transition-all duration-300 rounded-lg relative";
  const stateClasses = isActive 
    ? "bg-white/10 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-white after:rounded-full" 
    : "hover:bg-primary-dark/50 hover:shadow-md active:bg-primary-dark active:shadow-lg";
  const linkClasses = `${baseClasses} ${stateClasses} ${className}`.trim();

  const content = (
    <>
      <NavIcon 
        name={icon} 
        size={24} 
        className={`transition-transform duration-300 ${isActive ? 'text-white scale-110' : 'text-white/80'}`} 
      />
      <span 
        className={`
          font-medium text-lg whitespace-nowrap transition-all duration-300
          ${isActive ? 'text-white translate-x-1' : 'text-white/80'}
        `}
      >
        {children}
      </span>
    </>
  );

  return (
    <li className="animate-fade-in">
      {to ? (
        <Link
          to={to}
          className={linkClasses}
          onClick={onClick ? handleClick : undefined}
          aria-current={isActive ? 'page' : undefined}
        >
          {content}
        </Link>
      ) : (
        <button
          onClick={handleClick}
          className={linkClasses}
          aria-pressed={isActive}
        >
          {content}
        </button>
      )}
    </li>
  );
});

NavItem.displayName = 'NavItem';

export default NavItem; 