// SocialMediaSection.tsx
import React, { useEffect, useState, useCallback, useMemo, useRef, memo } from 'react';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import { motion } from 'framer-motion';
import { SocialEmbedRow } from '../functions/types';
import DOMPurify from 'dompurify';
import { trackEvent } from '@/utils/googleAnalytics';
import { loadFacebookSDK, loadInstagramEmbed } from '@/utils/socialScripts';
import { cc, cn } from '@/styles/shared';

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

const SocialMediaSection: React.FC<SocialMediaSectionProps> = memo(({ socialEmbeds }) => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('SocialMediaSection');

  const [isLoading, setIsLoading] = useState(true);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const instagramRefs = useRef<Map<string, HTMLElement>>(new Map());
  const processedEmbeds = useRef<Set<string>>(new Set());
  const processingTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const isMounted = useRef(false);
  const scriptsLoadingRef = useRef(false);

  // Detect iOS devices
  const isIOS = useMemo(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    return /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
  }, []);

  // Stable key based only on embed IDs
  const componentKey = useMemo(() =>
    socialEmbeds.map(e => e.id).join('-'),
    [socialEmbeds]
  );

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
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Set mounted flag - runs first
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
      scriptsLoadingRef.current = false;
      processingTimeouts.current.forEach(timeout => clearTimeout(timeout));
      processingTimeouts.current.clear();
    };
  }, []);

  const processInstagramEmbed = useCallback((embedId: string, node: HTMLElement) => {
    // Check if already processed
    if (processedEmbeds.current.has(embedId)) {
      return;
    }

    if (!scriptsLoaded || !window.instgrm?.Embeds?.process) {
      return;
    }

    // Mark as processed immediately to prevent duplicates
    processedEmbeds.current.add(embedId);

    // Clear any existing timeout for this embed
    const existingTimeout = processingTimeouts.current.get(embedId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Process with delay to ensure DOM is ready - longer delay for iOS
    const delay = isIOS ? 1000 : 300;
    const timeoutId = setTimeout(() => {
      if (!isMounted.current) return;

      try {
        // For iOS, try multiple processing attempts
        if (isIOS) {
          let attempts = 0;
          const maxAttempts = 3;
          const processWithRetry = () => {
            if (attempts >= maxAttempts) return;

            try {
              window.instgrm!.Embeds.process(node);
              // Check if embed was actually processed by looking for processed class
              const processedElements = node.querySelectorAll('.instagram-media-rendered');
              if (processedElements.length > 0) {
                processingTimeouts.current.delete(embedId);
                return;
              }
            } catch (e) {
              console.error(`Instagram processing attempt ${attempts + 1} failed for ${embedId}:`, e);
            }

            attempts++;
            if (attempts < maxAttempts) {
              setTimeout(processWithRetry, 500);
            } else {
              // Remove from processed on all failures so it can be retried later
              processedEmbeds.current.delete(embedId);
            }
          };
          processWithRetry();
        } else {
          window.instgrm!.Embeds.process(node);
          processingTimeouts.current.delete(embedId);
        }
      } catch (e) {
        console.error(`Error processing Instagram embed ${embedId}:`, e);
        // Remove from processed on error so it can be retried
        processedEmbeds.current.delete(embedId);
      }
    }, delay);

    processingTimeouts.current.set(embedId, timeoutId);
  }, [scriptsLoaded, isIOS]);

  const renderEmbed = useCallback((embed: SocialEmbedRow) => {
    
    const getEmbedUrl = (code: string) => {
      const urlMatch = code.match(/src="([^\"]+)"/);
      return urlMatch ? urlMatch[1] : '';
    };

    switch (embed.platform) {
      case 'facebook':
        const fbUrl = getEmbedUrl(embed.embed_code);
        if (!fbUrl) {
          console.warn(`Could not extract Facebook URL for embed ID: ${embed.id}`);
          return <div className="p-4 text-center text-red-500">Kon Facebook post niet laden (URL niet gevonden).</div>;
        }
        return (
          <div className="facebook-container relative w-full h-[738px]">
            <iframe
              src={fbUrl}
              className="w-full h-full border-none"
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              title={`Facebook post ${embed.id}`}
              loading={isIOS ? "eager" : "lazy"}
              style={isIOS ? { backgroundColor: 'white' } : undefined}
              onLoad={(e) => {
                // iOS-specific: Prevent flickering by ensuring stable rendering
                if (isIOS) {
                  const iframe = e.target as HTMLIFrameElement;
                  // Add a small delay before any manipulation to prevent flickering
                  setTimeout(() => {
                    // Ensure iframe stays visible and doesn't flicker
                    if (iframe && iframe.style) {
                      iframe.style.opacity = '1';
                      iframe.style.visibility = 'visible';
                    }
                  }, 500);
                }
              }}
            />
          </div>
        );
      
      case 'instagram':
        const originalInstaHtml = embed.embed_code.split('<script')[0];
        if (!originalInstaHtml.trim()) {
          return <div className="p-4 text-center text-red-500">Kon Instagram post niet laden (Lege code).</div>;
        }
        const sanitizedInstaHtml = DOMPurify.sanitize(originalInstaHtml);
        
        return (
          <div
            className="instagram-container relative w-full min-h-[680px]"
            ref={(node) => {
              if (node) {
                instagramRefs.current.set(embed.id, node);
                // Only process if scripts are loaded and not already processed
                if (scriptsLoaded && !processedEmbeds.current.has(embed.id)) {
                  processInstagramEmbed(embed.id, node);
                }
              } else {
                instagramRefs.current.delete(embed.id);
                processedEmbeds.current.delete(embed.id);
              }
            }}
            dangerouslySetInnerHTML={{
              __html: sanitizedInstaHtml
            }}
          />
        );
      
      default:
        console.warn(`Unsupported social platform: ${embed.platform}`);
        return null;
    }
  }, [scriptsLoaded, processInstagramEmbed]);

  const loadScripts = useCallback(async () => {
    // Prevent multiple simultaneous loads
    if (scriptsLoadingRef.current) {
      return;
    }

    if (!isMounted.current) {
      return;
    }

    scriptsLoadingRef.current = true;
    setIsLoading(true);
    setScriptsLoaded(false);
    setError(null);
    processedEmbeds.current.clear();

    try {
      const results = await Promise.all([
        loadFacebookSDK(),
        loadInstagramEmbed()
      ]);

      // Always set scriptsLoaded even if unmounted - the scripts ARE loaded
      setScriptsLoaded(true);

      if (isMounted.current) {
        trackEvent('social_section', 'sdk_loaded', `count:${socialEmbeds.length}`);
      }

    } catch (err: any) {
      if (isMounted.current) {
        console.error('Error loading social SDKs:', err);
        setError(err?.message || 'Er ging iets mis bij het laden van de social media scripts.');
        trackEvent('social_section', 'error', 'sdk_loading_failed');
        setScriptsLoaded(false);
      }
    } finally {
      scriptsLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [socialEmbeds.length]);

  // Load scripts on mount - runs after mount effect
  useEffect(() => {
    if (socialEmbeds.length > 0) {
      // Defer loading until after page load to avoid blocking initial render
      const loadAfterPageLoad = () => {
        if (isMounted.current) {
          loadScripts();
        }
      };

      window.addEventListener('load', loadAfterPageLoad, { once: true });

      return () => window.removeEventListener('load', loadAfterPageLoad);
    } else {
      setIsLoading(false);
      setScriptsLoaded(false);
    }
  }, [socialEmbeds.length, loadScripts]);

  // Process Instagram embeds when scripts are loaded
  useEffect(() => {
    if (!scriptsLoaded || !window.instgrm?.Embeds?.process) {
      return;
    }

    // Process all unprocessed embeds
    instagramRefs.current.forEach((node, embedId) => {
      if (!processedEmbeds.current.has(embedId)) {
        processInstagramEmbed(embedId, node);
      }
    });
  }, [scriptsLoaded, processInstagramEmbed]);

  // iOS-specific: Force re-processing on visibility change (when user scrolls)
  useEffect(() => {
    if (!isIOS || !scriptsLoaded) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Re-process any unprocessed Instagram embeds when page becomes visible
        instagramRefs.current.forEach((node, embedId) => {
          if (!processedEmbeds.current.has(embedId) && window.instgrm?.Embeds?.process) {
            processInstagramEmbed(embedId, node);
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isIOS, scriptsLoaded, processInstagramEmbed]);

  const handleSocialClick = (platform: string) => {
    trackEvent('social_section', 'social_click', platform);
  };

  const handleRetry = () => {
    loadScripts();
  };

  return (
    <motion.div
      key={componentKey}
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
          className={cn(cc.text.h2, 'text-gray-900 mb-4')}
        >
          Laatste Nieuws
        </h2>
        <p
          className={cn(cc.typography.lead, 'text-gray-600')}
        >
          Volg ons op social media
        </p>
      </motion.div>

      {error && !isLoading && (
        <motion.div
          className="max-w-md mx-auto mb-12 p-4 bg-red-50 border border-red-200 rounded-lg text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <p className="text-red-600 mb-2">{error}</p>
          <button
            onClick={handleRetry}
            className="text-sm text-red-500 hover:text-red-600 underline font-semibold"
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
          [...Array(socialEmbeds.length > 0 ? Math.min(socialEmbeds.length, 2) : 2)].map((_, i) => (
            <motion.div
              key={`skeleton-${i}`}
              className="w-full flex justify-center"
              variants={itemVariants}
            >
              <EmbedSkeleton />
            </motion.div>
          ))
        ) : !error ? (
          socialEmbeds
            .sort((a, b) => a.order_number - b.order_number)
            .map((embed) => (
              <motion.div
                key={embed.id}
                className="w-full flex justify-center"
                variants={itemVariants}
                onClick={() => handleSocialClick(embed.platform)}
              >
                <div
                  className="w-full max-w-[500px] bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  role="article"
                  aria-label={`${embed.platform} post`}
                >
                  {renderEmbed(embed)}
                </div>
              </motion.div>
            ))
        ) : null }
      </motion.div>

      <style>
        {`
          .instagram-container {
            width: 100% !important;
            min-height: 680px;
          }

          .instagram-media {
            margin: 0 auto !important;
            min-width: 326px !important;
            width: 100% !important;
            max-width: 500px !important;
            background: white !important;
            border-radius: 0.75rem !important;
            overflow: hidden !important;
          }

          .facebook-container {
            width: 100% !important;
            height: 738px !important;
            max-width: 500px !important;
            margin: 0 auto !important;
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
            opacity: 1 !important;
            visibility: visible !important;
          }

          /* iOS-specific fixes for Facebook iframe flickering */
          @supports (-webkit-touch-callout: none) {
            .facebook-container iframe {
              -webkit-transform: translateZ(0) !important;
              transform: translateZ(0) !important;
              -webkit-backface-visibility: hidden !important;
              backface-visibility: hidden !important;
              -webkit-perspective: 1000px !important;
              perspective: 1000px !important;
            }
          }
        `}
      </style>

      <div id="fb-root"></div>
    </motion.div>
  );
});

SocialMediaSection.displayName = 'SocialMediaSection';

export default SocialMediaSection;
