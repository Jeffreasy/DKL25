import React, { useState, useCallback, memo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { trackEvent } from '@/utils/googleAnalytics';
import NavItem from './NavItem';
import MobileMenu from './MobileMenu';
import { NAV_ITEMS, DEFAULT_LOGO } from './constants';
import type { NavbarProps } from './types';

const Navbar = memo<NavbarProps>(({ 
  className = '',
  showSocials = true,
  customLogo,
  onNavigate 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const shouldBeScrolled = window.scrollY > 20;
      if (isScrolled !== shouldBeScrolled) {
        setIsScrolled(shouldBeScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => {
      const newState = !prev;
      trackEvent('navbar', newState ? 'menu_open' : 'menu_close');
      return newState;
    });
  }, []);

  const handleNavigation = useCallback((path: string) => {
    onNavigate?.(path);
    if (isMenuOpen) {
      toggleMenu();
    }
  }, [onNavigate, isMenuOpen, toggleMenu]);

  const isPathActive = useCallback((path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  const navbarClasses = `
    fixed top-0 left-0 right-0 z-40 
    bg-primary ${isScrolled ? 'shadow-lg' : ''} 
    h-20 font-heading transition-all duration-300
    ${className}
  `.trim();

  return (
    <>
      <nav className={navbarClasses} aria-label="Hoofdnavigatie">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 h-full max-w-full lg:max-w-6xl xl:max-w-7xl">
          <div className="flex items-center justify-between h-full">
            {/* Logo met shine effect */}
            <div className="flex-shrink-0 relative overflow-hidden rounded-lg group">
              <Link 
                to="/" 
                className="block relative" 
                aria-label="Home"
                onClick={() => handleNavigation('/')}
              >
                <img 
                  src={customLogo || DEFAULT_LOGO}
                  alt="Logo" 
                  className="h-16 w-auto relative z-10 transition-transform group-hover:scale-105"
                  loading="lazy"
                  width={64}
                  height={64}
                />
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:justify-center lg:flex-1 animate-fade-in">
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

            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-3 rounded-lg text-white hover:bg-primary-dark transition-colors"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Menu sluiten' : 'Menu openen'}
            >
              <MenuIcon sx={{ fontSize: 28 }} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <MobileMenu
          isOpen={isMenuOpen}
          onClose={toggleMenu}
        />
      </nav>
      {/* Spacer */}
      <div className="h-20" aria-hidden="true" />
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
