// SocialMediaSection.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SocialEmbedRow } from '../functions/types';
import DOMPurify from 'dompurify';
import { trackEvent } from '@/utils/googleAnalytics';

interface SocialMediaSectionProps {
  socialEmbeds: SocialEmbedRow[];
}

const EmbedSkeleton: React.FC = () => (
  <div className="w-full max-w-[500px] bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="p-4 space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4" />
      <div className="h-[300px] bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  </div>
);

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({ socialEmbeds }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [embedsProcessed, setEmbedsProcessed] = useState(false);

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const renderEmbed = (embed: SocialEmbedRow) => {
    // Extract the URL from the embed code
    const getEmbedUrl = (code: string) => {
      const urlMatch = code.match(/src="([^"]+)"/);
      return urlMatch ? urlMatch[1] : '';
    };

    switch (embed.platform) {
      case 'facebook':
        const fbUrl = getEmbedUrl(embed.embed_code);
        return (
          <div className="facebook-container relative w-full h-[738px]">
            <iframe
              src={fbUrl}
              className="w-full h-full border-none"
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            />
          </div>
        );
      case 'instagram':
        // Remove script tag from Instagram embed code
        const instaHtml = embed.embed_code.split('<script')[0];
        return (
          <div 
            className="instagram-container relative w-full min-h-[680px]"
            ref={(node) => {
              if (node && window.instgrm) {
                window.instgrm.Embeds.process(node);
              }
            }}
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(instaHtml)
            }}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const loadEmbeds = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load Instagram embed script
        const instagramScript = document.createElement('script');
        instagramScript.src = 'https://www.instagram.com/embed.js';
        instagramScript.async = true;
        document.body.appendChild(instagramScript);

        instagramScript.onload = () => {
          if (window.instgrm) {
            window.instgrm.Embeds.process();
          }
          setEmbedsProcessed(true);
          trackEvent('social_section', 'embeds_loaded', `count:${socialEmbeds.length}`);
          setTimeout(() => setIsLoading(false), 500);
        };

      } catch (err) {
        console.error('Error loading social embeds:', err);
        setError('Er ging iets mis bij het laden van de social media posts.');
        trackEvent('social_section', 'error', 'embed_loading_failed');
        setIsLoading(false);
      }
    };

    if (socialEmbeds.length > 0) {
      loadEmbeds();
    } else {
      setIsLoading(false);
    }

    return () => {
      const scripts = document.querySelectorAll('script[src*="instagram.com"]');
      scripts.forEach(script => script.remove());
    };
  }, [socialEmbeds]);

  const handleSocialClick = (platform: string) => {
    trackEvent('social_section', 'social_click', platform);
  };

  const handleRetry = () => {
    setEmbedsProcessed(false);
    window.location.reload();
  };

  return (
    <motion.div 
      className="max-w-[1100px] mx-auto px-4 py-12 relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="mb-12 text-center"
        variants={itemVariants}
      >
        <h2 
          className="text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-gray-900 font-bold tracking-tight mb-4"
          style={{fontFamily: "'Montserrat', sans-serif"}}
        >
          Laatste Nieuws
        </h2>
        <p 
          className="text-[clamp(1.25rem,3vw,1.5rem)] text-gray-600"
          style={{fontFamily: "'Open Sans', sans-serif"}}
        >
          Volg ons op social media
        </p>
      </motion.div>

      {error && (
        <motion.div 
          className="max-w-md mx-auto mb-12 p-4 bg-red-50 border border-red-200 rounded-lg text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-red-600 mb-2">{error}</p>
          <button
            onClick={handleRetry}
            className="text-sm text-red-500 hover:text-red-600 underline"
          >
            Opnieuw proberen
          </button>
        </motion.div>
      )}

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
        variants={containerVariants}
      >
        {isLoading ? (
          // Loading skeletons
          [...Array(2)].map((_, i) => (
            <motion.div 
              key={`skeleton-${i}`}
              className="w-full min-h-[500px]"
              variants={itemVariants}
            >
              <EmbedSkeleton />
            </motion.div>
          ))
        ) : (
          // Social media embeds
          socialEmbeds
            .sort((a, b) => a.order_number - b.order_number) // Sorteer op order_number
            .map((embed) => (
              <motion.div 
                key={embed.id}
                className="w-full flex justify-center"
                variants={itemVariants}
              >
                <div 
                  className="w-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  role="article"
                  aria-label={`${embed.platform} post`}
                >
                  {renderEmbed(embed)}
                </div>
              </motion.div>
            ))
        )}
      </motion.div>

      <style>
        {`
          .instagram-container {
            width: 100% !important;
          }

          .instagram-container blockquote {
            margin: 0 !important;
            width: 100% !important;
            max-width: none !important;
            background: white !important;
          }

          .facebook-container {
            width: 100% !important;
            height: 738px !important;
            background: white !important;
            border-radius: 0.75rem !important;
            overflow: hidden !important;
          }

          .facebook-container iframe {
            width: 100% !important;
            height: 100% !important;
            border: none !important;
            margin: 0 !important;
            display: block !important;
          }
        `}
      </style>

      {/* Facebook SDK root element */}
      <div id="fb-root"></div>
    </motion.div>
  );
};

// Add TypeScript declaration for window object
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: (element?: HTMLElement) => void;
      };
    };
    FB?: {
      XFBML: {
        parse: () => void;
      };
    };
  }
}

export default React.memo(SocialMediaSection);
