import React, { useEffect, useRef, useState } from 'react';
import BackgroundVideo from '../../../features/video/components/BackgroundVideo';
import { trackEvent } from '@/utils/googleAnalytics';
import { useModal } from '@/contexts/ModalContext';
import { cc, cn, colors, animations } from '@/styles/shared';

// Video URL met Cloudinary WebM - optimized for performance
const HERO_VIDEO_URL = 'https://res.cloudinary.com/dgfuv7wif/video/upload/v1760450059/tt6k80_1_i9orgw_cbdcks.webm' as const;

const HeroSection: React.FC = () => {
  const { handleOpenProgramModal } = useModal();
  const sectionRef = useRef<HTMLElement>(null);
  const [videoStatus, setVideoStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [videoErrorMsg, setVideoErrorMsg] = useState<string | null>(null);

  // Track hero section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
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
    };
  }, []);

  const handleProgrammaClick = () => {
    trackEvent('hero', 'program_click', 'programma_tijden_button');
    handleOpenProgramModal('Start/Finish/Feest');
  };

  return (
    <section
      ref={sectionRef}
      className={cn('relative h-[calc(100vh-5rem)]', cc.typography.heading)}
      role="banner"
      aria-labelledby="hero-heading"
    >
      <BackgroundVideo
        videoUrl={HERO_VIDEO_URL}
        priority // Direct laden voor hero
        onPlay={() => {
          setVideoStatus('loaded');
          trackEvent('hero', 'video_play', 'background_video');
        }}
        onPause={() => trackEvent('hero', 'video_pause', 'background_video')}
        onEnded={() => trackEvent('hero', 'video_end', 'background_video')}
        onError={(error: Error) => {
          setVideoStatus('error');
          setVideoErrorMsg(error.message);
          trackEvent('hero', 'video_error', error.message);
        }}
        title="Achtergrondvideo van de Koninklijke Loop 2026"
      />


      {/* Content overlay */}
      <div className={cn('relative', cc.zIndex.dropdown, cc.flex.col, 'h-full px-4')} style={{ containIntrinsicSize: '1px 5000px' }}>
        <div className={cn('w-full max-w-5xl mx-auto pt-16 sm:pt-20 md:pt-24 lg:pt-28', cc.flex.center)}>
          <div className={cn('bg-black/30 backdrop-blur-sm p-4 sm:p-6', cc.border.rounded, 'text-center min-h-[280px] flex flex-col justify-center w-full')} style={{ willChange: 'auto' }}>
            <h1 id="hero-heading" className={cn(cc.text.h1, 'font-bold text-white leading-tight drop-shadow-lg')}>
              De sponsorloop van mensen met een beperking voor een goed doel!
            </h1>
            <p className={cn(cc.typography.lead, 'text-white/90 mt-3 drop-shadow-md')}>
              Samen maken we het verschil
            </p>
            <div className={cn('mt-6 px-4 py-3 rounded-md text-center max-w-sm mx-auto', colors.primary.bg)} role="complementary" aria-label="Evenement informatie">
              <div className="mb-2">
                <span className={cn(cc.text.bodyLarge, 'block text-white font-bold')}>DKL 2026 - De Koninklijke Loop</span>
                <time dateTime="2026-05-17" className={cn(cc.text.body, 'block text-white/90')}>Zaterdag 17 mei 2026</time>
              </div>
              <button
                onClick={handleProgrammaClick}
                className={cn(
                  cc.button.primary,
                  'mt-1 px-3 py-1.5 shadow-sm transform-gpu',
                  cc.a11y.focusVisible
                )}
                aria-label="Open programma en tijden modal"
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