import React, { useState, useCallback, memo, useRef, useEffect } from 'react';
import { useSponsors } from '@/hooks/useSponsors';
import { trackEvent } from '@/utils/googleAnalytics';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { SponsorRow } from '@/features/sponsors';
import { useModal } from '@/contexts/ModalContext';
import { sponsorService } from '../services/sponsorService';
import { cc, cn, colors, animations } from '@/styles/shared';

// Skeleton component for loading state
const SponsorCardSkeleton: React.FC<{ index: number }> = memo(({ index }) => (
  <div
    className={cn(
      'bg-white rounded-2xl overflow-hidden',
      cc.shadow.lg,
      'opacity-100 translate-y-0' // Show immediately for loading state
    )}
  >
    {/* Logo skeleton */}
    <div className={cn('aspect-[3/2] p-8 bg-gray-50', cc.flex.center)}>
      <div className={cn('w-20 h-20 bg-gray-200 rounded-lg', animations.pulse)} />
    </div>

    {/* Content skeleton */}
    <div className="p-8 space-y-3">
      <div className={cn('h-6 bg-gray-200 rounded', animations.pulse)} />
      <div className={cn('h-4 bg-gray-200 rounded', animations.pulse)} />
      <div className={cn('h-4 bg-gray-200 rounded w-3/4', animations.pulse)} />
    </div>
  </div>
));

SponsorCardSkeleton.displayName = 'SponsorCardSkeleton';

// Memoized individual sponsor card component
interface SponsorCardProps {
  sponsor: SponsorRow;
  index: number;
  onClick: (sponsor: SponsorRow) => void;
  isVisible: boolean;
}

const SponsorCard: React.FC<SponsorCardProps> = memo(({ sponsor, index, onClick, isVisible }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    trackEvent('sponsors', 'image_error', sponsor.name);
  }, [sponsor.name]);

  const handleClick = useCallback(() => {
    trackEvent('sponsors', 'sponsor_card_click', sponsor.name);
    onClick(sponsor);
  }, [sponsor, onClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <div
      ref={cardRef}
      className={cn(
        'group relative bg-white rounded-2xl cursor-pointer',
        cc.shadow.lg,
        'hover:shadow-xl',
        cc.transition.base,
        'hover:-translate-y-1',
        // Simple fade in animation
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        cc.transition.base
      )}
      style={{
        transitionDelay: isVisible ? `${index * 50}ms` : '0ms'
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Meer informatie over ${sponsor.name}`}
    >
      {/* Logo Container */}
      <div className={cn('aspect-[3/2] p-8 bg-gray-50 group-hover:bg-gray-100 rounded-t-2xl', cc.flex.center, cc.transition.colors)}>
        <div className={cn('relative w-full h-full', cc.flex.center)}>
          {imageError ? (
            // Fallback for broken images
            <div className={cn('w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center', cc.text.muted)}>
              <span className="text-2xl">🏢</span>
            </div>
          ) : (
            <>
              {/* Loading skeleton */}
              {!imageLoaded && (
                <div className={cn('absolute inset-0 bg-gray-200 rounded-lg', animations.pulse)} />
              )}
              <img
                src={sponsor.logo_url}
                alt={`${sponsor.name} logo`}
                className={cn(
                  'max-w-[85%] max-h-[85%] object-contain group-hover:scale-105',
                  cc.transition.base,
                  // Fade in when loaded
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                )}
                loading="lazy"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </>
          )}
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <h3 className={cn(cc.text.h4, 'font-bold text-gray-900 mb-3', 'group-hover:text-primary', cc.transition.colors)}>
          {sponsor.name}
        </h3>
        <p className={cn(cc.text.body, cc.text.muted, 'leading-relaxed line-clamp-3')}>
          {sponsor.description}
        </p>
      </div>

      {/* Hover Overlay */}
      <div className={cn('absolute inset-0 rounded-2xl ring-1 ring-black/5 group-hover:ring-primary/20', cc.transition.colors)} />
    </div>
  );
});

SponsorCard.displayName = 'SponsorCard';

const DKLSponsors: React.FC = () => {
  const { sponsors, isLoading, error } = useSponsors();
  const { handleOpenSponsorModal } = useModal();
  const [isVisible, setIsVisible] = useState(true); // Start visible for immediate loading
  const gridRef = useRef<HTMLDivElement>(null);

  // Intersection observer for animation timing (not for visibility)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            // Small delay to ensure smooth animation
            setTimeout(() => setIsVisible(true), 100);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const handleOpenSponsorModalLocal = useCallback((sponsor: SponsorRow) => {
    console.log(`DKLSponsors: Triggering handleOpenSponsorModal(${sponsor.name}) from context`);
    const sponsorData = sponsorService.transformToSponsor(sponsor);
    handleOpenSponsorModal(sponsorData);
  }, [handleOpenSponsorModal]);

  if (isLoading) {
    return (
      <section className={cn('py-20 px-5 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden', cc.typography.heading)}>
        <div className={cn(cc.container.wide, 'max-w-6xl')}>
          {/* Title skeleton */}
          <div className="text-center mb-16">
            <div className={cn('h-12 bg-gray-200 rounded-lg mx-auto w-80 mb-4', animations.pulse)} />
            <div className={cn('h-6 bg-gray-200 rounded mx-auto w-96', animations.pulse)} />
          </div>

          {/* Sponsors grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 max-w-5xl mx-auto">
            {Array.from({ length: 6 }).map((_, index) => (
              <SponsorCardSkeleton key={index} index={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={cn('py-20 px-5 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden', cc.typography.heading)}>
        <div className={cn(cc.container.wide, 'max-w-6xl')}>
          <div className={cn('text-center', cc.text.error)}>
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (sponsors.length === 0) {
    return null;
  }

  return (
    <section 
      className={cn('py-20 px-5 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden', cc.typography.heading)}
      aria-labelledby="sponsors-title"
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={cn('absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-gradient-radial from-primary/3 to-transparent blur-[100px]', cc.border.circle, animations.pulseSlow)} />
        <div className={cn('absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-radial from-primary/2 to-transparent blur-[80px]', cc.border.circle, animations.float)} />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Title Section */}
        <div className="text-center mb-16 relative">
          <h2 
            id="sponsors-title"
            className={cn(cc.text.h2, 'text-gray-900 font-bold mb-4 tracking-tight')}
          >
            Onze Sponsors
          </h2>
          <p className={cn(cc.text.h5, cc.text.muted, 'max-w-2xl mx-auto mb-8 leading-relaxed')}>
            Deze geweldige partners maken De Koninklijke Loop mogelijk
          </p>
          <div className="relative mx-auto w-16 h-0.5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-45 from-transparent via-primary/40 to-transparent" />
            <div className={cn('absolute inset-0 bg-gradient-45 from-transparent via-primary/20 to-transparent', animations.shine)} />
          </div>
        </div>

        {/* Sponsors Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 max-w-5xl mx-auto"
        >
          {sponsors.map((sponsor, index) => (
            <SponsorCard
              key={sponsor.id}
              sponsor={sponsor}
              index={index}
              onClick={handleOpenSponsorModalLocal}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DKLSponsors; 