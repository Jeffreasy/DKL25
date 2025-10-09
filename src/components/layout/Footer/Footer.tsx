import React, { useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import SocialIcon from '../Socials/SocialIcon';
import { socialLinks, createQuickLinks } from './data';
import { PrivacyModal } from '../modals';
import type { FooterProps, QuickLinkType } from './types';
import { trackEvent } from '@/utils/googleAnalytics';

const MemoizedSocialIcon = memo(SocialIcon);

const Footer: React.FC<FooterProps> = ({ 
  className = '', 
  showSocials = true, 
  showQuickLinks = true,
  customLogo
}) => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const currentYear = new Date().getFullYear();
  
  const handlePrivacyClick = useCallback(() => {
    try {
      setIsPrivacyModalOpen(true);
      trackEvent('footer', 'privacy_policy_click');
    } catch (error) {
      console.error('Error handling privacy click:', error);
    }
  }, []);

  const handleSocialClick = useCallback((platform: string) => {
    try {
      trackEvent('footer', 'social_media_click', platform);
    } catch (error) {
      console.error('Error tracking social click:', error);
    }
  }, []);

  const handleQuickLinkClick = useCallback((linkText: string) => {
    try {
      trackEvent('footer', 'quick_link_click', linkText);
    } catch (error) {
      console.error('Error tracking quick link click:', error);
    }
  }, []);

  const quickLinks = createQuickLinks(handlePrivacyClick);
  
  return (
    <>
      <footer className={`bg-gradient-to-br from-primary to-primary-dark py-12 px-4 font-heading text-white mt-auto relative overflow-hidden ${className}`}>
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 relative">
          {/* Left Column */}
          <div className="flex flex-col items-center md:items-start space-y-6">
            <div className="relative">
              <img
                src={customLogo || "https://res.cloudinary.com/dgfuv7wif/image/upload/v1733267882/664b8c1e593a1e81556b4238_0760849fb8_yn6vdm.png"}
                alt="De Koninklijke Loop logo"
                className={`w-[120px] transition-all duration-500 ${logoLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onLoad={() => setLogoLoaded(true)}
              />
              {!logoLoaded && (
                <div className="absolute inset-0 bg-white/10 animate-pulse rounded-lg" />
              )}
            </div>

            <div className="text-center md:text-left space-y-2">
              <h2 className="text-xl font-bold tracking-tight">Doe je met ons mee?</h2>
              <p className="text-sm text-white/90">Samen op weg voor een goed doel.</p>
              <p className="text-lg font-semibold bg-gradient-to-r from-yellow-200 to-yellow-500 text-transparent bg-clip-text">
                Loop mee met de Koninklijke Loop!
              </p>
            </div>

            {/* Social Links */}
            {showSocials && (
              <nav 
                className="flex gap-4" 
                aria-label="Social media links"
              >
                {socialLinks.map(({ platform, url, hoverColor, label }) => (
                  <a
                    key={platform}
                    href={url}
                    className={`social-link w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm ${hoverColor} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group`}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleSocialClick(platform)}
                  >
                    <MemoizedSocialIcon 
                      platform={platform} 
                      className="w-5 h-5 fill-white transition-transform group-hover:scale-110" 
                    />
                  </a>
                ))}
              </nav>
            )}
          </div>

          {/* Right Column */}
          {showQuickLinks && (
            <div className="flex flex-col items-center md:items-start space-y-6">
              <h3 className="text-lg font-bold tracking-tight">Snelle Links</h3>
              <nav aria-label="Quick links">
                <ul className="grid grid-cols-2 gap-x-12 gap-y-3">
                  {quickLinks.map((link: QuickLinkType) => (
                    <li key={link.text} className="relative group">
                      {link.to ? (
                        <Link
                          to={link.to}
                          className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors group-hover:translate-x-1 duration-300"
                          onClick={() => handleQuickLinkClick(link.text)}
                        >
                          <span className="text-lg">{link.icon}</span>
                          <span className="text-sm font-medium">{link.text}</span>
                        </Link>
                      ) : (
                        <button
                          onClick={() => {
                            link.action?.();
                            handleQuickLinkClick(link.text);
                          }}
                          className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors group-hover:translate-x-1 duration-300"
                        >
                          <span className="text-lg">{link.icon}</span>
                          <span className="text-sm font-medium">{link.text}</span>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </div>

        {/* Bottom Copyright */}
        <div className="relative mt-12 pt-6 border-t border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-sm text-white/80">
              &copy; {currentYear} De Koninklijke Loop. Alle rechten voorbehouden.
            </p>
            <p className="text-xs text-white/60">
              Met ❤️ gemaakt voor een betere wereld
            </p>
          </div>
        </div>
      </footer>

      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </>
  );
};

export default memo(Footer); 