import React, { memo, useState } from 'react';
import { trackEvent } from '@/utils/googleAnalytics';
import { cc, cn, colors, animations } from '@/styles/shared';

interface ContentItemProps {
  icon: string;
  title: string;
  text: string;
  illustration?: {
    src: string;
    caption: string;
  };
  mapUrl?: string;
}

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
    trackEvent('dkl', 'image_loaded', alt);
  };

  const handleError = () => {
    setHasError(true);
    trackEvent('dkl', 'image_error', alt);
  };

  const handleClick = () => {
    trackEvent('dkl', 'image_click', alt);
    onClick?.();
  };

  return (
    <div className="relative">
      {!isLoaded && !hasError && (
        <div className={cn('absolute inset-0 bg-gray-200 animate-pulse rounded', className)} />
      )}
      {hasError ? (
        <div className={cn('flex items-center justify-center bg-gray-100 text-gray-400 rounded', className)}>
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

// Optimized Map Component with lazy loading
const OptimizedMap: React.FC<{
  src: string;
  title: string;
  className?: string;
  onClick?: () => void;
}> = memo(({ src, title, className, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    trackEvent('dkl', 'map_loaded', title);
  };

  const handleClick = () => {
    trackEvent('dkl', 'map_click', title);
    onClick?.();
  };

  return (
    <div className={cn('relative', className)} onClick={handleClick}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-500 text-sm">Kaart laden...</div>
        </div>
      )}
      <iframe
        src={src}
        className={cn('w-full h-[500px] border-0', !isLoaded && 'opacity-0')}
        scrolling="no"
        title={title}
        loading="lazy"
        onLoad={handleLoad}
      />
    </div>
  );
});

OptimizedMap.displayName = 'OptimizedMap';

export const ContentItem: React.FC<ContentItemProps> = memo(({
  icon,
  title,
  text,
  illustration,
  mapUrl
}) => {
  return (
    <div className={cn(
      'bg-white rounded-xl p-6 border border-gray-100 relative overflow-hidden group',
      cc.shadow.lg,
      cc.transition.base,
      'hover:shadow-xl hover:-translate-y-1'
    )}>
      {/* Decorative circle */}
      <div className={cn('absolute -top-20 -right-20 w-40 h-40 bg-primary/10', cc.border.circle, cc.transition.base, 'group-hover:scale-110')} />

      {/* Content */}
      <div className="relative z-10">
        <span className={cn('material-icons-round text-4xl mb-4 block', colors.primary.text)}>
          {icon}
        </span>
        <h2 className={cn(cc.text.h3, cc.typography.heading, 'font-semibold text-gray-900 mb-4')}>
          {title}
        </h2>
        <p className={cn(cc.text.body, cc.text.muted, 'leading-relaxed mb-6')}>
          {text}
        </p>

        {illustration && (
          <div className="text-center my-8">
            <div className={cn('relative overflow-hidden rounded-xl', cc.transition.base, 'hover:scale-[1.02]')}>
              <OptimizedImage
                src={illustration.src}
                alt={`Tekening: ${illustration.caption}`}
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
            <p className={cn('mt-2 italic', cc.text.small, 'text-gray-500')}>
              Tekening: {illustration.caption}
            </p>
          </div>
        )}

        {mapUrl && (
          <div className={cn('mt-6 rounded-xl overflow-hidden', cc.shadow.lg)}>
            <OptimizedMap
              src={mapUrl}
              title="Route kaart"
            />
          </div>
        )}
      </div>
    </div>
  );
});

ContentItem.displayName = 'ContentItem';