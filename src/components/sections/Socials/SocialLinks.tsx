import React, { useEffect, useState, memo, useCallback, useMemo } from 'react';
import type { SocialLink } from './types';
import SocialIcon from './SocialIcon';
import { supabase } from '@/lib/supabase';
import { trackEvent } from '@/utils/googleAnalytics';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import { cc, cn, colors, animations } from '@/styles/shared';

const DKLSocials: React.FC = memo(() => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('DKLSocials');

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize social colors to prevent recreation
  const socialColors = useMemo(() => ({
    facebook: '#4267B2', // Official Facebook brand color
    instagram: '#E1306C', // Official Instagram brand color
    youtube: '#FF0000',   // Official YouTube brand color
    linkedin: '#0A66C2'   // Official LinkedIn brand color
  }), []);

  // Memoize loading skeletons array
  const loadingSkeletons = useMemo(() =>
    [...Array(4)].map((_, i) => (
      <div
        key={i}
        className={cn('aspect-square rounded-2xl bg-gray-800/30', animations.pulse)}
      />
    )), []);

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
          trackInteraction('error', 'fetch_failed');
        } else if (data) {
          const transformedData: SocialLink[] = data.map(item => ({
            platform: item.platform as SocialLink['platform'],
            url: item.url,
            bgColorClass: item.bg_color_class,
            iconColorClass: item.icon_color_class
          }));
          setSocialLinks(transformedData);
          trackEvent('social', 'loaded', `count:${data.length}`);
          trackInteraction('loaded', `count:${data.length}`);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Er ging iets mis. Probeer het later opnieuw.');
        trackEvent('social', 'error', 'unexpected');
        trackInteraction('error', 'unexpected');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSocialLinks();
  }, [trackInteraction]);

  const handleSocialClick = useCallback((platform: string) => {
    trackEvent('social', 'social_click', platform);
    trackInteraction('click', platform);
  }, [trackInteraction]);

  return (
    <section className={cn('bg-gray-900 py-20 px-5 relative overflow-hidden', cc.typography.heading)}>
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative">
        {/* Title with animated underline */}
        <div className="text-center mb-16 relative">
          <h2 className={cn(cc.text.h2, 'text-white font-semibold mb-5 relative')}>
            Volg ons op sociale media
            <span className={cn(
              'absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full',
              colors.primary.bg,
              'after:content-[\'\'] after:absolute after:top-0 after:left-0 after:w-full after:h-full',
              'after:bg-white/30 after:rounded-full',
              animations.pulse
            )} />
          </h2>
        </div>

        {/* Error state */}
        {error && (
          <div className={cn('text-red-400 text-center mb-8 px-4 py-3', cc.border.rounded, 'bg-red-900/20 backdrop-blur-sm max-w-md mx-auto')}>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className={cn('mt-2', cc.text.small, 'text-white/70 hover:text-white', cc.transition.colors)}
            >
              Opnieuw proberen
            </button>
          </div>
        )}

        {/* Social Icons Grid with loading state */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8 max-w-[800px] mx-auto">
          {isLoading ? (
            // Loading skeletons
            loadingSkeletons
          ) : (
            // Social media links
            socialLinks.map((social: SocialLink) => (
              <a
                key={social.platform}
                href={social.url}
                style={{
                  '--social-color': socialColors[social.platform]
                } as React.CSSProperties}
                className={cn(
                  'aspect-square',
                  cc.flex.center,
                  'rounded-2xl group relative overflow-hidden backdrop-blur-sm',
                  cc.transition.slow,
                  'hover:-translate-y-2 hover:scale-105',
                  colors.primary.focusRing,
                  'focus:ring-offset-gray-900',
                  'bg-gray-800/50 hover:bg-[var(--social-color)]',
                  cc.shadow.lg,
                  'shadow-black/5 hover:shadow-xl hover:shadow-[var(--social-color)]/20'
                )}
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
                  className={cn(
                    'w-10 h-10 md:w-12 md:h-12',
                    cc.transition.slow,
                    'ease-out group-hover:scale-110 group-hover:rotate-3',
                    'text-white/60 group-hover:text-white',
                    'relative', cc.zIndex.dropdown,
                    'drop-shadow-lg'
                  )}
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
  });

DKLSocials.displayName = 'DKLSocials';

export default DKLSocials;