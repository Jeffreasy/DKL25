import React, { memo, useState, useEffect } from 'react';
import { cn } from '@/styles/shared';
import {
  getOptimizedImageUrl,
  getPictureSources,
  getThumbnailUrl,
  preloadImage,
  type ImageOptimizationOptions
} from '@/utils/imageOptimization';

export interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  publicId: string;
  options?: ImageOptimizationOptions;
  usePictureElement?: boolean;
  lazy?: boolean;
  showPlaceholder?: boolean;
  placeholderClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Optimized Image Component
 * Uses Cloudinary automatic format selection (f_auto) for optimal performance
 * Supports responsive images, lazy loading, and modern format fallbacks
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = memo(({
  publicId,
  options = {},
  usePictureElement = false,
  lazy = true,
  showPlaceholder = true,
  placeholderClassName,
  className,
  alt,
  onLoad,
  onError,
  ...imgProps
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate optimized URLs
  const optimizedUrl = getOptimizedImageUrl(publicId, options);
  const thumbnailUrl = showPlaceholder ? getThumbnailUrl(publicId, 50) : null;
  const pictureSources = usePictureElement ? getPictureSources(publicId, options) : null;

  // Preload critical images
  useEffect(() => {
    if (!lazy && optimizedUrl) {
      preloadImage(optimizedUrl, 'image');
    }
  }, [lazy, optimizedUrl]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Error state
  if (hasError) {
    return (
      <div className={cn(
        'flex items-center justify-center bg-gray-100 text-gray-400 text-sm',
        className
      )}>
        <span>Image could not be loaded</span>
      </div>
    );
  }

  // Picture element for modern format support
  if (usePictureElement && pictureSources) {
    return (
      <div className="relative">
        {showPlaceholder && !isLoaded && thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt=""
            className={cn(
              'absolute inset-0 w-full h-full object-cover blur-sm scale-110 opacity-50',
              placeholderClassName
            )}
            aria-hidden="true"
          />
        )}
        <picture>
          <source srcSet={pictureSources.avif} type="image/avif" />
          <source srcSet={pictureSources.webp} type="image/webp" />
          <source srcSet={pictureSources['jpeg-xl']} type="image/jxl" />
          <img
            src={pictureSources.fallback}
            alt={alt}
            className={cn(
              className,
              isLoaded ? 'opacity-100' : 'opacity-0',
              'transition-opacity duration-300'
            )}
            loading={lazy ? 'lazy' : 'eager'}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            {...imgProps}
          />
        </picture>
      </div>
    );
  }

  // Standard img element with automatic format selection
  return (
    <div className="relative">
      {showPlaceholder && !isLoaded && thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt=""
          className={cn(
            'absolute inset-0 w-full h-full object-cover blur-sm scale-110 opacity-50',
            placeholderClassName
          )}
          aria-hidden="true"
        />
      )}
      <img
        src={optimizedUrl}
        alt={alt}
        className={cn(
          className,
          isLoaded ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-300'
        )}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        {...imgProps}
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';