import React, { useEffect, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { trackEvent } from '@/utils/googleAnalytics';
import NavItem from './NavItem';
import SocialLink from './SocialLink';
import { NAV_ITEMS, SOCIAL_LINKS, DEFAULT_LOGO } from './constants';
import type { MobileMenuProps } from './types';

const MobileMenu = memo<MobileMenuProps>(({ isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      trackEvent('navbar', 'mobile_menu_open');
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleNavigation = () => {
    onClose();
    trackEvent('navbar', 'mobile_menu_close');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobiel menu"
    >
      <div
        ref={menuRef}
        className="fixed right-0 top-0 w-[280px] h-full bg-primary p-6 shadow-xl animate-slide-in overflow-y-auto"
        tabIndex={-1}
      >
        {/* Header met logo en sluit knop */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/" 
            className="block" 
            onClick={handleNavigation}
            aria-label="Home"
          >
            <img 
              src={DEFAULT_LOGO}
              alt="Logo" 
              className="h-12 w-auto"
              loading="lazy"
              width={48}
              height={48}
            />
          </Link>
          <button 
            onClick={onClose}
            className="p-2 text-white hover:bg-primary-dark rounded-full transition-colors"
            aria-label="Sluit menu"
          >
            <CloseIcon sx={{ fontSize: 24 }} />
          </button>
        </div>

        {/* Navigatie menu */}
        <nav className="mb-8" aria-label="Mobiele navigatie">
          <ul className="space-y-4 w-full">
            {NAV_ITEMS.map((item) => (
              <NavItem
                key={item.to}
                {...item}
                onClick={handleNavigation}
              />
            ))}
          </ul>
        </nav>

        {/* Social media links */}
        <div className="mt-auto pt-6 border-t border-white/20">
          <p className="text-sm text-white/90 font-medium mb-4 text-center">
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