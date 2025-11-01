import React, { useEffect, useRef, useCallback, memo } from 'react';
import BackgroundVideo from '../../../features/video/components/BackgroundVideo';
import { trackEvent } from '@/utils/googleAnalytics';
import { cc, cn } from '@/styles/shared';

// ============================================================================
// Constants
// ============================================================================

const HERO_VIDEO_URL = 'https://res.cloudinary.com/dgfuv7wif/video/upload/v1762012398/xabadh_2_wytkrb.mp4' as const;

const HERO_CONFIG = {
  title: 'De sponsorloop van mensen met een beperking voor een goed doel!',
  subtitle: 'Samen maken we het verschil',
  videoTitle: 'Achtergrondvideo van de Koninklijke Loop 2026',
  observerThreshold: 0.5,
} as const;

// ============================================================================
// Subcomponents
// ============================================================================

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

      {/* Content Overlay */}
      <HeroContent />
    </section>
  );
};

HeroSection.displayName = 'HeroSection';

export default memo(HeroSection);