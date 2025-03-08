import React, { useEffect, useState } from 'react';
import type { SocialLink } from './types';
import SocialIcon from './SocialIcon';
import { supabase } from '@/lib/supabase';
import { trackEvent } from '@/utils/googleAnalytics';

const socialColors = {
  facebook: '#4267B2',
  instagram: '#E1306C',
  youtube: '#FF0000',
  linkedin: '#0A66C2'
} as const;

const DKLSocials: React.FC = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('social_links')
          .select('*')
          .order('platform');

        if (error) {
          console.error('Error fetching social links:', error);
          setError('Er ging iets mis bij het laden van de sociale media links.');
          trackEvent('social', 'error', 'fetch_failed');
        } else if (data) {
          const transformedData: SocialLink[] = data.map(item => ({
            platform: item.platform as SocialLink['platform'],
            url: item.url,
            bgColorClass: item.bg_color_class,
            iconColorClass: item.icon_color_class
          }));
          setSocialLinks(transformedData);
          trackEvent('social', 'loaded', `count:${data.length}`);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Er ging iets mis. Probeer het later opnieuw.');
        trackEvent('social', 'error', 'unexpected');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  const handleSocialClick = (platform: string) => {
    trackEvent('social', 'social_click', platform);
  };

  return (
    <section className="bg-gray-900 py-20 px-5 font-heading relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative">
        {/* Title with animated underline */}
        <div className="text-center mb-16 relative">
          <h2 className="text-[clamp(1.75rem,4vw,2rem)] text-white font-semibold mb-5 relative">
            Volg ons op sociale media
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full 
              after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full 
              after:bg-white/30 after:rounded-full after:animate-pulse" />
          </h2>
        </div>

        {/* Error state */}
        {error && (
          <div className="text-red-400 text-center mb-8 px-4 py-3 rounded-lg bg-red-900/20 backdrop-blur-sm max-w-md mx-auto">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              Opnieuw proberen
            </button>
          </div>
        )}

        {/* Social Icons Grid with loading state */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8 max-w-[800px] mx-auto">
          {isLoading ? (
            // Loading skeletons
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-gray-800/30 animate-pulse"
              />
            ))
          ) : (
            // Social media links
            socialLinks.map((social: SocialLink) => (
              <a
                key={social.platform}
                href={social.url}
                style={{
                  '--social-color': socialColors[social.platform]
                } as React.CSSProperties}
                className={`
                  aspect-square flex items-center justify-center
                  rounded-2xl transition-all duration-500
                  group relative
                  hover:-translate-y-2 hover:scale-105
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900
                  bg-gray-800/50
                  hover:bg-[var(--social-color)]
                  backdrop-blur-sm
                  overflow-hidden
                  shadow-lg shadow-black/5
                  hover:shadow-xl hover:shadow-[var(--social-color)]/20
                `}
                aria-label={`Volg ons op ${social.platform}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleSocialClick(social.platform)}
              >
                {/* Hover effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-[var(--social-color)]/0 group-hover:bg-[var(--social-color)]/10 transition-colors duration-500" />
                
                {/* Icon */}
                <SocialIcon
                  platform={social.platform}
                  className={`
                    w-10 h-10 md:w-12 md:h-12 
                    transition-all duration-500 ease-out
                    group-hover:scale-110 group-hover:rotate-3
                    text-white/60 group-hover:text-white
                    relative z-10
                    drop-shadow-lg
                  `}
                />

                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <div className="absolute inset-0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default DKLSocials; 