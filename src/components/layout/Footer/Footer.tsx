import React, { useState, useCallback, memo, useMemo, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { socialLinks, createQuickLinks } from './data';
import { PrivacyModal } from '../../ui/modals';
import type { FooterProps, QuickLinkType } from './types';
import { trackEvent } from '@/utils/googleAnalytics';
import { cc, cn, colors } from '@/styles/shared';

// Lazy load SocialIcon to reduce initial bundle size
const SocialIcon = React.lazy(() => import('../../sections/Socials/SocialIcon'));

const DEFAULT_LOGO_PUBLIC_ID = '664b8c1e593a1e81556b4238_0760849fb8_yn6vdm';
const CURRENT_YEAR = new Date().getFullYear();

const Footer: React.FC<FooterProps> = memo(({
  className = '',
  showSocials = true,
  showQuickLinks = true,
  customLogo,
}) => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  // Memoize accessibility preferences to prevent recalculation
  const accessibilityPrefs = useMemo(() => ({
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    currentPath: window.location.pathname
  }), []);

  const handlePrivacyClick = useCallback(() => {
    setIsPrivacyModalOpen(true);
    trackEvent('footer', 'privacy_policy_click');
  }, []);

  const handleSocialClick = useCallback((platform: string) => {
    trackEvent('footer', 'social_media_click', platform);
  }, []);

  const handleQuickLinkClick = useCallback((linkText: string) => {
    trackEvent('footer', 'quick_link_click', linkText);
  }, []);

  const quickLinks = useMemo(() => createQuickLinks(handlePrivacyClick), [handlePrivacyClick]);

  return (
    <>
      <footer
        role="contentinfo"
        className={cn(
          colors.gradient.footer,
          'py-12 px-4 text-white mt-auto relative overflow-hidden min-h-[300px] h-[300px]',
          cc.typography.heading,
          className
        )}
      >
        {!accessibilityPrefs.prefersReducedMotion && (
          <div className="absolute inset-0 opacity-5" style={{ willChange: 'auto', contain: 'layout style paint' }}>
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" style={{ willChange: 'transform', transform: 'translate3d(-50%, -50%, 0)' }} />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" style={{ willChange: 'transform', transform: 'translate3d(50%, 50%, 0)' }} />
          </div>
        )}

        <div className={cn(cc.container.wide, 'grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 relative')}>
          <section className={cn(cc.flex.col, 'items-center md:items-start space-y-6')} aria-labelledby="footer-about">
            <div className="relative">
              <img
                src={customLogo || `https://res.cloudinary.com/dkl25/image/upload/w_120,h_120,c_fill,q_auto,f_auto/${DEFAULT_LOGO_PUBLIC_ID}`}
                alt="De Koninklijke Loop logo"
                className={cn('w-[100px] sm:w-[120px]', cc.transition.slow, logoLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95')}
                onLoad={() => setLogoLoaded(true)}
                loading="lazy"
                width="120"
                height="120"
                decoding="async"
              />
              {!logoLoaded && (
                <div className={cn('absolute inset-0 bg-white/10 rounded-lg', cc.loading.skeleton)} aria-hidden="true" />
              )}
            </div>

            <div className="text-center md:text-left space-y-2" style={{ minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h2 id="footer-about" className={cn(cc.text.h4, 'tracking-tight')}>Doe je met ons mee?</h2>
              <p className={cn(cc.text.small, 'text-white/90')}>Samen op weg voor een goed doel.</p>
              <p className={cn(cc.text.h5, 'bg-gradient-to-r from-yellow-200 to-yellow-500 text-transparent bg-clip-text')}>
                Loop mee met de Koninklijke Loop!
              </p>
            </div>

            {showSocials && (
              <nav className="flex gap-4" aria-label="Volg ons op social media">
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
                      accessibilityPrefs.prefersReducedMotion ? '' : 'hover:-translate-y-1 hover:shadow-lg',
                      'group'
                    )}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleSocialClick(platform)}
                  >
                    <Suspense fallback={<div className="w-5 h-5 bg-white/20 rounded" aria-hidden="true" />}>
                      <SocialIcon
                        platform={platform}
                        className={cn('w-5 h-5 fill-white', cc.transition.transform, accessibilityPrefs.prefersReducedMotion ? '' : 'group-hover:scale-110')}
                      />
                    </Suspense>
                  </a>
                ))}
              </nav>
            )}
          </section>

          {showQuickLinks && (
            <section className={cn(cc.flex.col, 'items-center md:items-start space-y-6')} aria-labelledby="footer-links">
              <h3 id="footer-links" className={cn(cc.text.h5, 'tracking-tight')}>Snelle Links</h3>
              <nav aria-label="Footer snelle links">
                <ul className="grid grid-cols-2 gap-x-12 gap-y-3" role="list">
                  {quickLinks.map((link: QuickLinkType) => (
                    <li key={link.text} className="relative group" role="listitem">
                      {link.to ? (
                        <Link
                          to={link.to}
                          className={cn(
                            cc.flex.start,
                            'space-x-2 text-white/90 hover:text-white',
                            cc.transition.colors,
                            accessibilityPrefs.prefersReducedMotion ? '' : 'group-hover:translate-x-1 duration-300'
                          )}
                          aria-current={accessibilityPrefs.currentPath === link.to ? 'page' : undefined}
                          onClick={() => handleQuickLinkClick(link.text)}
                        >
                          <span className={cc.text.h5} aria-hidden="true">{link.icon}</span>
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
                            accessibilityPrefs.prefersReducedMotion ? '' : 'group-hover:translate-x-1 duration-300'
                          )}
                          aria-label={`${link.text} openen`}
                        >
                          <span className={cc.text.h5} aria-hidden="true">{link.icon}</span>
                          <span className={cn(cc.text.small, 'font-medium')}>{link.text}</span>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </section>
          )}
        </div>

        <div className={cn('relative mt-12 pt-6', cc.divider.horizontal, 'border-white/10')} role="contentinfo">
          <div className={cn(cc.container.wide, cc.flex.between, 'flex-col md:flex-row gap-4 text-center md:text-left')}>
            <p className={cn(cc.text.small, 'text-white/80')}>
              &copy; {CURRENT_YEAR} De Koninklijke Loop. Alle rechten voorbehouden.
            </p>
            <p className={cn(cc.text.small, 'text-white/60')}>
              Met ❤️ gemaakt voor een betere wereld
            </p>
          </div>
        </div>
      </footer>

      <Suspense fallback={null}>
        <PrivacyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
      </Suspense>
    </>
  );
});

Footer.displayName = 'Footer';

export default Footer;