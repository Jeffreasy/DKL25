import React, { useEffect, useState } from 'react';
import type { SocialLink } from './types';
import SocialIcon from './SocialIcon';
import { supabase } from '@/lib/supabaseClient';

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
    <section className="bg-[#0B1120] py-20 px-5 font-heading">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl text-white font-semibold mb-2">
            Volg ons op <span className="border-b-2 border-primary pb-1">sociale media</span>
          </h2>
        </div>

        <div className="grid grid-cols-4 gap-8 max-w-[800px] mx-auto">
          {socialLinks.map((social: SocialLink, index) => (
            <a
              key={social.platform}
              href={social.url}
              style={{
                '--social-color': socialColors[social.platform],
                animationDelay: `${index * 100}ms`
              } as React.CSSProperties}
              className={`
                aspect-square flex items-center justify-center
                rounded-lg transition-all duration-300
                bg-[#1E293B] hover:bg-[var(--social-color)]
                group relative overflow-hidden
                hover:shadow-lg hover:shadow-[var(--social-color)]/20
                animate-slide-up
                hover:scale-105
              `}
              aria-label={`Volg ons op ${social.platform}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="absolute inset-0 bg-gradient-45 from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <SocialIcon
                platform={social.platform}
                className="w-16 h-16 text-white/60 group-hover:text-white 
                  transition-all duration-300 transform group-hover:scale-110"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DKLSocials; 