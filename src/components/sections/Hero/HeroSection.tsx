import React, { useEffect, useRef, useCallback, memo, useMemo } from 'react';
import BackgroundVideo from '../../../features/video/components/BackgroundVideo';
import { trackEvent } from '@/utils/googleAnalytics';
import { cc, cn } from '@/styles/shared';
import { usePublicStepsCounter } from '@/services/websocket/usePublicStepsCounter';

// ============================================================================
// Constants
// ============================================================================

const HERO_VIDEO_URL = 'https://res.cloudinary.com/dgfuv7wif/video/upload/v1762012398/xabadh_2_wytkrb.mp4' as const;

const HERO_CONFIG = {
  title: 'De sponsorloop van mensen met een beperking voor een goed doel!',
  subtitle: 'Samen maken we het verschil',
  videoTitle: 'Achtergrondvideo van de Koninklijke Loop 2026',
  observerThreshold: 0.5,
  stepsToMeters: 0.76, // Gemiddelde stap lengte in meters
} as const;

/**
 * Convert steps to meters
 */
const stepsToMeters = (steps: number): number => {
  return Math.round(steps * HERO_CONFIG.stepsToMeters);
};

/**
 * Format meters with thousands separator
 */
const formatMeters = (meters: number): string => {
  return meters.toLocaleString('nl-NL');
};

// ============================================================================
// Subcomponents
// ============================================================================

/**
 * Total meters counter displayed at the top of the hero section
 */
interface TotalMetersCounterProps {
  totalMeters: number;
}

const TotalMetersCounter = memo<TotalMetersCounterProps>(({ totalMeters }) => (
  <div
    className={cn(
      'absolute inset-x-0 top-0',
      'bg-gradient-to-b from-black/70 via-black/40 to-transparent',
      'px-4 sm:px-6 pt-8 sm:pt-12 pb-20 sm:pb-24',
      cc.zIndex.dropdown
    )}
  >
    <div className="w-full max-w-7xl mx-auto text-center">
      <div
        className={cn(
          'inline-flex flex-col items-center gap-2',
          'animate-fade-in'
        )}
      >
        <p
          className={cn(
            'text-white/90 text-sm sm:text-base font-medium',
            'drop-shadow-xl'
          )}
        >
          Totaal gelopen
        </p>
        <div
          className={cn(
            'text-4xl sm:text-5xl md:text-6xl font-bold text-white',
            'drop-shadow-2xl',
            'tabular-nums'
          )}
        >
          {formatMeters(totalMeters)}
          <span className="text-2xl sm:text-3xl md:text-4xl ml-2">m</span>
        </div>
      </div>
    </div>
  </div>
));

TotalMetersCounter.displayName = 'TotalMetersCounter';

/**
 * Hero content overlay with gradient background
 */
const HeroContent = memo(() => (
  <div
    className={cn(
      'absolute inset-x-0 bottom-0',
      'bg-gradient-to-t from-black/70 via-black/40 to-transparent',
      'px-4 sm:px-6 pb-12 sm:pb-16 pt-24 sm:pt-32',
      cc.zIndex.dropdown
    )}
  >
    <div className="w-full max-w-7xl mx-auto text-center">
      <h1
        id="hero-heading"
        className={cn(
          cc.text.h1,
          'font-bold text-white leading-tight',
          'drop-shadow-2xl',
          'animate-fade-in'
        )}
      >
        {HERO_CONFIG.title}
      </h1>
      <p
        className={cn(
          cc.typography.lead,
          'text-white/95 mt-4 sm:mt-6',
          'drop-shadow-xl',
          'animate-fade-in-delay'
        )}
      >
        {HERO_CONFIG.subtitle}
      </p>
    </div>
  </div>
));

HeroContent.displayName = 'HeroContent';

// ============================================================================
// Main Component
// ============================================================================

/**
 * Hero Section Component
 * 
 * Full-viewport hero section with background video and centered content.
 * Includes visibility tracking and analytics integration.
 * 
 * @component
 */
const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  // ============================================================================
  // Real-time Steps via WebSocket
  // ============================================================================
  
  const { totalSteps, isConnected } = usePublicStepsCounter();
  
  const totalMeters = useMemo(() => {
    return stepsToMeters(totalSteps);
  }, [totalSteps]);

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const handleVideoPlay = useCallback(() => {
    trackEvent('hero', 'video_play', 'background_video');
  }, []);

  const handleVideoPause = useCallback(() => {
    trackEvent('hero', 'video_pause', 'background_video');
  }, []);

  const handleVideoEnded = useCallback(() => {
    trackEvent('hero', 'video_end', 'background_video');
  }, []);

  const handleVideoError = useCallback((error: Error) => {
    console.error('[HeroSection] Video error:', error);
    trackEvent('hero', 'video_error', error.message);
  }, []);

  // ============================================================================
  // Effects
  // ============================================================================

  /**
   * Track hero section visibility using Intersection Observer
   * Fires once when section comes into view
   */
  useEffect(() => {
    const currentSection = sectionRef.current;
    if (!currentSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackEvent('hero', 'section_view', 'hero_section');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: HERO_CONFIG.observerThreshold,
        rootMargin: '0px'
      }
    );

    observer.observe(currentSection);

    return () => {
      observer.disconnect();
    };
  }, []);

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative h-[calc(100vh-5rem)] overflow-hidden',
        cc.typography.heading
      )}
      role="banner"
      aria-labelledby="hero-heading"
    >
      {/* Background Video Layer */}
      <BackgroundVideo
        videoUrl={HERO_VIDEO_URL}
        priority
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
        onEnded={handleVideoEnded}
        onError={handleVideoError}
        title={HERO_CONFIG.videoTitle}
      />

      {/* Total Meters Counter - Top */}
      <TotalMetersCounter totalMeters={totalMeters} />

      {/* Content Overlay - Bottom */}
      <HeroContent />
    </section>
  );
};

HeroSection.displayName = 'HeroSection';

export default memo(HeroSection);