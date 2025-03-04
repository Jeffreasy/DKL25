import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SocialIcon from '../Socials/SocialIcon';
import { socialLinks, createQuickLinks } from './data';
import { PrivacyModal } from '../modals';
import type { FooterProps, QuickLinkType } from './types';
import { trackEvent } from '@/utils/googleAnalytics';

const Footer: React.FC<FooterProps> = () => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  
  const handlePrivacyClick = () => {
    setIsPrivacyModalOpen(true);
    trackEvent('footer', 'privacy_policy_click');
  };

  const handleSocialClick = (platform: string) => {
    trackEvent('footer', 'social_media_click', platform);
  };

  const handleQuickLinkClick = (linkText: string) => {
    trackEvent('footer', 'quick_link_click', linkText);
  };

  const quickLinks = createQuickLinks(handlePrivacyClick);
  
  return (
    <>
      <footer className="bg-primary py-12 px-4 font-heading text-white mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="flex flex-col items-center md:items-start">
            <img
              src="https://res.cloudinary.com/dgfuv7wif/image/upload/v1733267882/664b8c1e593a1e81556b4238_0760849fb8_yn6vdm.png"
              alt="De Koninklijke Loop logo"
              className="w-[90px] mb-4"
            />
            <div className="text-center md:text-left space-y-0.5 mb-4">
              <p className="text-sm opacity-90">Doe je met ons mee?</p>
              <p className="text-xs opacity-80">Samen op weg voor een goed doel.</p>
              <p className="text-sm font-semibold">Loop mee met de Koninklijke Loop!</p>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-4">
              {socialLinks.map(({ platform, url, hoverColor }) => (
                <a
                  key={platform}
                  href={url}
                  className={`social-link w-9 h-9 flex items-center justify-center rounded-full bg-white/10 ${hoverColor} transition-all duration-300 hover:-translate-y-0.5 group`}
                  aria-label={platform}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleSocialClick(platform)}
                >
                  <SocialIcon 
                    platform={platform} 
                    className="w-[18px] h-[18px] fill-white transition-transform group-hover:scale-110" 
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-base font-semibold mb-4">Snelle Links</h3>
            <ul className="space-y-2 text-center md:text-left">
              {quickLinks.map((link: QuickLinkType) => (
                <li key={link.text}>
                  {link.to ? (
                    <Link
                      to={link.to}
                      className="text-sm opacity-90 hover:opacity-100 hover:underline transition-opacity"
                      onClick={() => handleQuickLinkClick(link.text)}
                    >
                      {link.text}
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        link.action?.();
                        handleQuickLinkClick(link.text);
                      }}
                      className="text-sm opacity-90 hover:opacity-100 hover:underline transition-opacity"
                    >
                      {link.text}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 pt-4 border-t border-white/20 text-center">
          <p className="text-xs opacity-80">
            &copy; {currentYear} De Koninklijke Loop. Alle rechten voorbehouden.
          </p>
        </div>
      </footer>

      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </>
  );
};

export default Footer; 