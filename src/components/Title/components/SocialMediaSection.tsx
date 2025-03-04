// SocialMediaSection.tsx
import React, { useEffect } from 'react';
import { SocialEmbedRow } from '../functions/types';
import DOMPurify from 'dompurify';
import { trackEvent } from '@/utils/googleAnalytics';

interface SocialMediaSectionProps {
  socialEmbeds: SocialEmbedRow[];
}

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({ socialEmbeds }) => {
  useEffect(() => {
    // Trigger Instagram embed
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
    // Trigger Facebook embed
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, [socialEmbeds]);

  const handleSocialClick = (platform: string) => {
    trackEvent('title_social', 'social_click', platform);
  };

  const renderEmbed = (embed: SocialEmbedRow) => {
    switch (embed.platform) {
      case 'facebook':
        return (
          <div 
            className="fb-post"
            data-href="https://www.facebook.com/permalink.php?story_fbid=pfbid02onoifpUokqack1LTTdEHWDe8qHeucu9FhWhk4JgQ2TXZNEXfzNndS46ZJifD9Trzl&id=61556315443279"
            data-width="500"
            data-show-text="false"
          />
        );
      case 'instagram':
        return (
          <div 
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(embed.embed_code) 
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[900px] mx-auto px-4 py-6 relative">
      <div className="mb-8 text-center">
        <h2 
          className="text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-gray-900 font-bold tracking-tight mb-2"
          style={{fontFamily: "'Montserrat', sans-serif"}}
        >
          Laatste Nieuws
        </h2>
        <p 
          className="text-[clamp(1.25rem,3vw,1.5rem)] text-gray-600"
          style={{fontFamily: "'Open Sans', sans-serif"}}
        >
          Bekijk op onze social media
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1100px] mx-auto">
        {socialEmbeds.map((embed) => (
          <div 
            key={embed.id}
            className="w-full flex justify-center"
          >
            <div className="w-full max-w-[500px] bg-white rounded-lg shadow-md overflow-hidden">
              {renderEmbed(embed)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Add TypeScript declaration for window object
declare global {
  interface Window {
    instgrm?: any;
    FB?: any;
  }
}

export default SocialMediaSection;
