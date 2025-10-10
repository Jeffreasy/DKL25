import React, { useState, memo } from 'react';
import { trackEvent } from '@/utils/googleAnalytics';
import { cc, cn, colors } from '@/styles/shared';

// Optimized Image Component with lazy loading and error handling
const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  onClick?: () => void;
  priority?: boolean;
}> = memo(({ src, alt, className, loading = 'lazy', onClick, priority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    trackEvent('over_ons', 'image_loaded', alt);
  };

  const handleError = () => {
    setHasError(true);
    trackEvent('over_ons', 'image_error', alt);
  };

  const handleClick = () => {
    trackEvent('over_ons', 'image_click', alt);
    onClick?.();
  };

  return (
    <div className="relative">
      {!isLoaded && !hasError && (
        <div className={cn('absolute inset-0 bg-gray-200 animate-pulse rounded', className)} />
      )}
      {hasError ? (
        <div className={cn(
          'flex items-center justify-center bg-gray-100 text-gray-400 rounded',
          className
        )}>
          <span className="text-sm">Afbeelding niet beschikbaar</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={cn(
            className,
            !isLoaded && 'opacity-0',
            isLoaded && 'opacity-100',
            cc.transition.base,
            onClick && 'cursor-pointer'
          )}
          loading={priority ? 'eager' : loading}
          onLoad={handleLoad}
          onError={handleError}
          onClick={handleClick}
        />
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

const AboutImage: React.FC = memo(() => {
  return (
    <div className="my-12 text-center max-w-4xl mx-auto">
      <div className="relative overflow-hidden rounded-xl mb-6 group">
        <OptimizedImage
          src="https://cdn.prod.website-files.com/65c6896e8519c5d0bae5586f/66c263cb03f03f94f9921898_8c4a504471.jpg"
          alt="Teamleden wandelend"
          className={cn('w-full h-auto block', cc.transition.base, 'group-hover:scale-102')}
          loading="eager"
          priority={true}
        />
      </div>
      <div className={cn(cc.flex.col, 'items-center gap-4')}>
        <p className={cn(cc.text.h5, cc.text.muted, 'font-light leading-relaxed max-w-2xl border-b border-gray-200 pb-4')}>
          <span className={cn('material-icons-round align-middle mr-1', colors.primary.text)}>
            people
          </span>
          Van links naar rechts: Jeffrey | Salih | Peter | Fenny | Michel kon helaas niet bij de fotoshoot aanwezig zijn.
        </p>
        <a
          href="https://beeldpakker.nl/"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'group flex items-center rounded',
            cc.transition.base,
            'hover:-translate-y-1',
            'focus:outline-none focus:ring-2 focus:ring-primary/20'
          )}
          aria-label="Bezoek de website van Beeldpakker"
        >
          <OptimizedImage
            src="https://cdn.prod.website-files.com/65c6896e8519c5d0bae5586f/664f48b72335550e9cdfadf8_a7963a8992%20(1).png"
            alt="Beeldpakker - Fotografie"
            className={cn('h-[140px] w-auto opacity-95 group-hover:opacity-100', cc.transition.base)}
            loading="lazy"
          />
          <span className={cn('material-icons-round opacity-0 group-hover:opacity-100 ml-2', colors.primary.text, cc.transition.base)}>
            launch
          </span>
        </a>
      </div>
    </div>
  );
});

AboutImage.displayName = 'AboutImage';

export default AboutImage;