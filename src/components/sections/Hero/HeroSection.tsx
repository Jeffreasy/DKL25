import React, { useEffect, useRef, useCallback, useState } from 'react';
import BackgroundVideo from '../../../features/video/components/BackgroundVideo';
import { trackEvent } from '@/utils/googleAnalytics';
import { useModal } from '@/contexts/ModalContext';
import { cc, cn, colors } from '@/styles/shared';

// Video URLs as constants for better maintainability
const HERO_VIDEO_URLS = {
  webm: 'https://res.cloudinary.com/dgfuv7wif/video/upload/tt6k80_1_i9orgw.webm',
  mp4: 'https://res.cloudinary.com/dgfuv7wif/video/upload/tt6k80_1_i9orgw.mp4',
  poster: 'https://res.cloudinary.com/dgfuv7wif/video/upload/tt6k80_1_i9orgw.jpg'
} as const;

// Remove HeroSectionProps if no props are needed
// interface HeroSectionProps {}

const HeroSection: React.FC = () => { // No props expected
  const { handleOpenProgramModal } = useModal(); // Get handler from context
  const sectionRef = useRef<HTMLElement>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Track when the hero section becomes visible using intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            trackEvent('hero', 'section_view', 'hero_section');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
      observer.disconnect();
    };
  }, []);

  const handleProgrammaClick = () => {
    console.log("HeroSection: Triggering openProgramModal from context");
    trackEvent('hero', 'program_click', 'programma_tijden_button');
    handleOpenProgramModal('Start/Finish/Feest'); // Call context function
  };

  return (
    <section
      ref={sectionRef}
      className={cn('relative h-[calc(100vh-5rem)]', cc.typography.heading)}
      role="banner"
      aria-label="Hero sectie"
    >
      <BackgroundVideo
        webmUrl={HERO_VIDEO_URLS.webm}
        mp4Url={HERO_VIDEO_URLS.mp4}
        posterUrl={HERO_VIDEO_URLS.poster}
        onPlay={() => {
          setVideoLoaded(true);
          setVideoError(null);
          trackEvent('hero', 'video_play', 'background_video');
        }}
        onPause={() => trackEvent('hero', 'video_pause', 'background_video')}
        onEnded={() => trackEvent('hero', 'video_end', 'background_video')}
        onError={(error: Error) => {
          setVideoError(error.message);
          trackEvent('hero', 'video_error', error.message);
        }}
      />

      {/* Video loading/error overlay */}
      {videoError && (
        <div className={cn('absolute inset-0 bg-black/50 flex items-center justify-center', cc.zIndex.dropdown)}>
          <div className="text-center text-white p-4">
            <p className="mb-2">Video kon niet worden geladen</p>
            <p className="text-sm opacity-75">{videoError}</p>
          </div>
        </div>
      )}

      {!videoLoaded && !videoError && (
        <div className={cn('absolute inset-0 bg-black/30 flex items-center justify-center', cc.zIndex.dropdown)}>
          <div className={cn('w-12 h-12 border-4 border-white/20 border-t-white', cc.border.circle, 'animate-spin')} />
        </div>
      )}
      <div className={cn('relative', cc.zIndex.dropdown, cc.flex.col, 'h-full px-4')}>
        <div className={cn('w-full max-w-5xl mx-auto pt-16 sm:pt-20 md:pt-24 lg:pt-28', cc.flex.center)}>
          <div className={cn('bg-black/30 backdrop-blur-sm p-4 sm:p-6', cc.border.rounded, 'text-center')}>
            <h1 className={cn(cc.text.h1, 'font-bold text-white leading-tight drop-shadow-lg')}>
              De sponsorloop van mensen met een beperking voor een goed doel!
            </h1>
            <p className={cn(cc.typography.lead, 'text-white/90 mt-3 drop-shadow-md')}>
              Samen maken we het verschil
            </p>
            <div className={cn('mt-6 px-4 py-3 rounded-md text-center max-w-sm mx-auto', colors.primary.bg)}>
              <div className="mb-2">
                <span className={cn(cc.text.bodyLarge, 'block text-white font-bold')}>De Koninklijke Loop 2025</span>
                <span className={cn(cc.text.body, 'block text-white/90')}>Zaterdag 17 mei 2025</span>
              </div>
              <button
                onClick={handleProgrammaClick}
                className={cn(
                  'mt-1 px-3 py-1.5 bg-white shadow-sm',
                  colors.primary.text,
                  cc.text.body,
                  cc.border.circle,
                  'hover:bg-gray-100 hover:scale-105 active:scale-95 font-semibold',
                  cc.transition.base,
                  'transform-gpu' // Use GPU acceleration for transforms
                )}
              >
                Programma/tijden
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  ); 
};  

export default React.memo(HeroSection);