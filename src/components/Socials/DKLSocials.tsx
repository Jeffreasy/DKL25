import React, { useEffect, useState } from 'react';
import type { SocialLink } from './types';
import SocialIcon from './SocialIcon';
import { supabase } from '@/lib/supabase';

const socialColors = {
  facebook: '#4267B2',
  instagram: '#E1306C',
  youtube: '#FF0000',
  linkedin: '#0A66C2'
} as const;

const DKLSocials: React.FC = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('platform');

      if (error) {
        console.error('Error fetching social links:', error);
      } else if (data) {
        // Transform de data naar het juiste formaat
        const transformedData: SocialLink[] = data.map(item => ({
          platform: item.platform as SocialLink['platform'],
          url: item.url,
          bgColorClass: item.bg_color_class,
          iconColorClass: item.icon_color_class
        }));
        setSocialLinks(transformedData);
      }
    };

    fetchSocialLinks();
  }, []);

  return (
    <section className="bg-gray-900 py-20 px-5 font-heading">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16 relative">
          <h2 className="text-[clamp(1.75rem,4vw,2rem)] text-white font-semibold mb-5">
            Volg ons op sociale media
          </h2>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[3px] bg-primary rounded-full" />
        </div>

        {/* Social Icons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8 max-w-[800px] mx-auto">
          {socialLinks.map((social: SocialLink) => (
            <a
              key={social.platform}
              href={social.url}
              style={{
                '--social-color': socialColors[social.platform]
              } as React.CSSProperties}
              className={`
                aspect-square flex items-center justify-center
                rounded-2xl transition-all duration-500
                hover:-translate-y-1 hover:shadow-lg
                focus:outline-none focus:ring-2 focus:ring-primary/40
                bg-gray-800/50
                hover:bg-[var(--social-color)]
                backdrop-blur-sm backdrop-filter
                relative group overflow-hidden
                before:absolute before:inset-0
                before:bg-gradient-to-br before:from-white/5 before:to-white/0
                hover:before:opacity-20
                shadow-lg shadow-black/5
              `}
              aria-label={`Volg ons op ${social.platform}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SocialIcon
                platform={social.platform}
                className={`
                  w-10 h-10 md:w-12 md:h-12 
                  transition-all duration-500
                  group-hover:scale-110
                  text-white/60 group-hover:text-white
                  relative z-10
                `}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DKLSocials; 