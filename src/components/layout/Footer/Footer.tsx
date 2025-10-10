import React, { useState, useCallback, memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SocialIcon from '../../sections/Socials/SocialIcon';
import { socialLinks, createQuickLinks } from './data';
import { PrivacyModal } from '../../ui/modals';
import type { FooterProps, QuickLinkType, SocialLink } from './types';
import { trackEvent } from '@/utils/googleAnalytics';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import { cc, cn, colors } from '@/styles/shared';

const DEFAULT_LOGO = 'https://res.cloudinary.com/dgfuv7wif/image/upload/v1733267882/664b8c1e593a1e81556b4238_0760849fb8_yn6vdm.png';
const MemoizedSocialIcon = memo(SocialIcon);

const Footer: React.FC<FooterProps> = memo(({
  className = '',
  showSocials = true,
  showQuickLinks = true,
  customLogo,
}) => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('Footer');

  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  // Memoize current year to prevent recalculation
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  // Memoize accessibility preferences to prevent recalculation
  const accessibilityPrefs = useMemo(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    trackInteraction('accessibility_check', prefersReducedMotion ? 'reduced_motion' : 'normal_motion');
    return {
      prefersReducedMotion,
      showDecorativeElements: !prefersReducedMotion,
      hoverStyles: prefersReducedMotion ? '' : 'hover:-translate-y-1 hover:shadow-lg',
      transformStyles: prefersReducedMotion ? '' : 'group-hover:scale-110',
      linkHoverStyles: prefersReducedMotion ? '' : 'group-hover:translate-x-1 duration-300'
    };
  }, [trackInteraction]);

  const handlePrivacyClick = useCallback(() => {
    try {
      setIsPrivacyModalOpen(true);
      trackEvent('footer', 'privacy_policy_click');
      trackInteraction('privacy_click', 'modal_opened');
    } catch (error) {
      console.error('Error handling privacy click:', error);
      // Sentry.captureException(error);
    }
  }, [trackInteraction]);

  const handleSocialClick = useCallback((platform: string) => {
    try {
      trackEvent('footer', 'social_media_click', platform);
      trackInteraction('social_click', platform);
    } catch (error) {
      console.error('Error tracking social click:', error);
      // Sentry.captureException(error);
    }
  }, [trackInteraction]);

  const handleQuickLinkClick = useCallback((linkText: string) => {
    try {
      trackEvent('footer', 'quick_link_click', linkText);
      trackInteraction('quick_link_click', linkText);
    } catch (error) {
      console.error('Error tracking quick link click:', error);
      // Sentry.captureException(error);
    }
  }, [trackInteraction]);

  const quickLinks = useMemo(() => createQuickLinks(handlePrivacyClick), [handlePrivacyClick]);

  return (
    <>
      <footer
        role="contentinfo"
        className={cn(
          colors.gradient.footer,
          'py-12 px-4 text-white mt-auto relative overflow-hidden',
          cc.typography.heading,
          className
        )}
      >
        {accessibilityPrefs.showDecorativeElements && (
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
          </div>
        )}

        <div className={cn(cc.container.wide, 'grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 relative')}>
          <div className={cn(cc.flex.col, 'items-center md:items-start space-y-6')}>
            <div className="relative">
              <img
                src={customLogo || DEFAULT_LOGO}
                alt="De Koninklijke Loop logo"
                className={cn('w-[100px] sm:w-[120px]', cc.transition.slow, logoLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95')}
                onLoad={() => setLogoLoaded(true)}
              />
              {!logoLoaded && (
                <div className={cn('absolute inset-0 bg-white/10 rounded-lg', cc.loading.skeleton)} />
              )}
            </div>

            <div className="text-center md:text-left space-y-2">
              <h2 className={cn(cc.text.h4, 'tracking-tight')}>Doe je met ons mee?</h2>
              <p className={cn(cc.text.small, 'text-white/90')}>Samen op weg voor een goed doel.</p>
              <p className={cn(cc.text.h5, 'font-semibold bg-gradient-to-r from-yellow-200 to-yellow-500 text-transparent bg-clip-text')}>
                Loop mee met de Koninklijke Loop!
              </p>
            </div>

            {showSocials && (
              <nav className="flex gap-4" aria-label="Social media links">
                {socialLinks.map(({ platform, url, hoverColor, label }) => (
                  <a
                    key={platform}
                    href={url}
                    className={cn(
                      'social-link w-10 h-10',
                      cc.flex.center,
                      'rounded-lg bg-white/10 backdrop-blur-sm',
                      hoverColor,
                      cc.transition.base,
                      accessibilityPrefs.hoverStyles,
                      'group'
                    )}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleSocialClick(platform)}
                  >
                    <MemoizedSocialIcon
                      platform={platform}
                      className={cn('w-5 h-5 fill-white', cc.transition.transform, accessibilityPrefs.transformStyles)}
                    />
                  </a>
                ))}
              </nav>
            )}
          </div>

          {showQuickLinks && (
            <div className={cn(cc.flex.col, 'items-center md:items-start space-y-6')}>
              <h3 className={cn(cc.text.h5, 'font-bold tracking-tight')}>Snelle Links</h3>
              <nav aria-label="Footer snelle links">
                <ul className="grid grid-cols-2 gap-x-12 gap-y-3">
                  {quickLinks.map((link: QuickLinkType) => (
                    <li key={link.text} className="relative group">
                      {link.to ? (
                        <Link
                          to={link.to}
                          className={cn(
                            cc.flex.start,
                            'space-x-2 text-white/90 hover:text-white',
                            cc.transition.colors,
                            accessibilityPrefs.linkHoverStyles
                          )}
                          aria-current={window.location.pathname === link.to ? 'page' : undefined}
                          onClick={() => handleQuickLinkClick(link.text)}
                        >
                          <span className={cc.text.h5}>{link.icon}</span>
                          <span className={cn(cc.text.small, 'font-medium')}>{link.text}</span>
                        </Link>
                      ) : (
                        <button
                          onClick={() => {
                            link.action?.();
                            handleQuickLinkClick(link.text);
                          }}
                          className={cn(
                            cc.flex.start,
                            'space-x-2 text-white/90 hover:text-white',
                            cc.transition.colors,
                            window.matchMedia('(prefers-reduced-motion: reduce)').matches ? '' : 'group-hover:translate-x-1 duration-300'
                          )}
                        >
                          <span className={cc.text.h5}>{link.icon}</span>
                          <span className={cn(cc.text.small, 'font-medium')}>{link.text}</span>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </div>

        <div className={cn('relative mt-12 pt-6', cc.divider.horizontal, 'border-white/10')}>
          <div className={cn(cc.container.wide, cc.flex.between, 'flex-col md:flex-row gap-4 text-center md:text-left')}>
            <p className={cn(cc.text.small, 'text-white/80')}>
              &copy; {currentYear} De Koninklijke Loop. Alle rechten voorbehouden.
            </p>
            <p className={cn('text-xs text-white/60')}>
              Met ❤️ gemaakt voor een betere wereld
            </p>
          </div>
        </div>
      </footer>

      <PrivacyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
    </>
  );
});

Footer.displayName = 'Footer';

export default Footer;