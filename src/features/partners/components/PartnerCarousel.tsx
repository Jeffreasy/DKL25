import React, { useState, useEffect, useRef, memo, Suspense, lazy } from 'react';
import { usePartners } from '@/hooks/usePartners';
import { useSwipe } from '@/hooks/useSwipe';
import { trackEvent } from '@/utils/googleAnalytics';
import { cc, cn } from '@/styles/shared';

// Lazy load the modal for better performance
const PartnerModal = lazy(() => import('@/components/ui/modals/PartnerModal').then(module => ({ default: module.PartnerModal })));

// Optimized Partner Image Component with lazy loading
const PartnerImage: React.FC<{
  partner: any;
  onClick: () => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}> = memo(({ partner, onClick, className, size = 'medium' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const sizeClasses = {
    small: 'w-24 h-12',
    medium: 'w-32 h-16',
    large: 'w-40 h-20'
  };

  const handleLoad = () => {
    setIsLoaded(true);
    trackEvent('partners', 'image_loaded', partner.name);
  };

  const handleError = () => {
    setHasError(true);
    trackEvent('partners', 'image_error', partner.name);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        cc.flex.center,
        'hover:opacity-75 focus:opacity-75',
        cc.transition.base,
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        sizeClasses[size],
        className
      )}
      aria-label={`Bekijk details van ${partner.name}`}
    >
      {!isLoaded && !hasError && (
        <div className={cn('animate-pulse bg-gray-200 rounded', sizeClasses[size])} />
      )}
      {hasError ? (
        <div className={cn(
          cc.flex.center,
          'bg-gray-100 text-gray-400 rounded',
          cc.text.small,
          sizeClasses[size]
        )}>
          Logo
        </div>
      ) : (
        <img
          ref={imgRef}
          src={partner.logo}
          alt={`Logo van ${partner.name}`}
          className={cn(
            'max-w-full max-h-full object-contain',
            !isLoaded && 'opacity-0'
          )}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </button>
  );
});

PartnerImage.displayName = 'PartnerImage';

// Skeleton component for loading state
const PartnerSkeleton: React.FC<{ size?: 'small' | 'medium' | 'large' }> = memo(({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-24 h-12',
    medium: 'w-32 h-16',
    large: 'w-40 h-20'
  };

  return (
    <div className={cn(
      cc.flex.center,
      'animate-pulse bg-gray-200 rounded',
      sizeClasses[size]
    )} />
  );
});

PartnerSkeleton.displayName = 'PartnerSkeleton';

const PartnerCarrousel: React.FC = memo(() => {
  const { partners, isLoading, error } = usePartners();
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Intersection observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-scroll for mobile carousel
  useEffect(() => {
    if (isPaused || !isVisible || partners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % partners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused, isVisible, partners.length]);

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe({
    onSwipeLeft: () => {
      setCurrentIndex(prev => (prev + 1) % partners.length);
      trackEvent('partners', 'carousel_swipe', 'left');
    },
    onSwipeRight: () => {
      setCurrentIndex(prev => (prev - 1 + partners.length) % partners.length);
      trackEvent('partners', 'carousel_swipe', 'right');
    },
  });

  const handlePartnerClick = (partnerId: string, partnerName: string) => {
    trackEvent('partners', 'partner_click', partnerName);
    setSelectedPartnerId(partnerId);
  };

  const handleModalClose = () => {
    trackEvent('partners', 'modal_closed', 'partner_details');
    setSelectedPartnerId(null);
  };

  const selectedPartner = partners.find(p => p.id === selectedPartnerId);

  if (error) {
    return (
      <section className="bg-white">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className={cn('text-center p-8', cc.text.error)}>
            <p className={cn(cc.text.body, 'mb-4')}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className={cn(cc.button.primary, 'px-4 py-2')}
            >
              Probeer opnieuw
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (partners.length === 0 && !isLoading) return null;

  return (
    <section ref={carouselRef} className="bg-white">
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        {isLoading ? (
          // Loading state with skeletons
          <>
            <div className={cn('hidden md:flex md:justify-center md:items-center md:gap-12')}>
              {Array.from({ length: 6 }).map((_, index) => (
                <PartnerSkeleton key={index} size="medium" />
              ))}
            </div>
            <div className="md:hidden relative overflow-hidden mx-auto py-4">
              <div className="flex gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <PartnerSkeleton key={index} size="small" />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Desktop view */}
            <div className={cn('hidden md:flex md:justify-center md:items-center md:gap-12')}>
              {isVisible && partners.map((partner) => (
                <PartnerImage
                  key={partner.id}
                  partner={partner}
                  onClick={() => handlePartnerClick(partner.id, partner.name)}
                  size="medium"
                />
              ))}
            </div>

            {/* Mobile carousel */}
            <div
              className="md:hidden relative overflow-hidden mx-auto py-4"
              onTouchStart={(e) => { handleTouchStart(e); setIsPaused(true); }}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => { handleTouchEnd(); setIsPaused(false); }}
            >
              <div className="flex items-center justify-center">
                <div className="flex gap-4 transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 112}px)` }}>
                  {isVisible && partners.concat(partners).map((partner, index) => (
                    <PartnerImage
                      key={`${partner.id}-${index}`}
                      partner={partner}
                      onClick={() => handlePartnerClick(partner.id, partner.name)}
                      size="small"
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Lazy loaded modal */}
      {selectedPartner && (
        <Suspense fallback={null}>
          <PartnerModal
            isOpen={true}
            onClose={handleModalClose}
            partner={selectedPartner}
          />
        </Suspense>
      )}
    </section>
  );
});

PartnerCarrousel.displayName = 'PartnerCarrousel';

export default PartnerCarrousel;