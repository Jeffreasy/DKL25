import React, { memo, useState, useCallback } from 'react';
import { cn } from '@/styles/shared';
import {
  getResponsiveImageSources,
  getPictureSources,
  getThumbnailUrl,
  type ImageOptimizationOptions
} from '@/utils/imageOptimization';

export interface ResponsiveImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  publicId: string;
  baseOptions?: ImageOptimizationOptions;
  breakpoints?: { width: number; media: string }[];
  usePictureElement?: boolean;
  showPlaceholder?: boolean;
  placeholderClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Responsive Image Component
 * Automatically generates responsive images with WebP/AVIF fallbacks
 * Uses Cloudinary automatic format selection and responsive breakpoints
 */
export const ResponsiveImage: React.FC<ResponsiveImageProps> = memo(({
  publicId,
  baseOptions = {},
  breakpoints = [
    { width: 480, media: '(max-width: 480px)' },
    { width: 768, media: '(max-width: 768px)' },
    { width: 1024, media: '(max-width: 1024px)' },
    { width: 1280, media: '(max-width: 1280px)' },
    { width: 1920, media: '(min-width: 1281px)' }
  ],
  usePictureElement = true,
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

  // Generate responsive sources
  const responsiveSources = getResponsiveImageSources(publicId, baseOptions, breakpoints);
  const thumbnailUrl = showPlaceholder ? getThumbnailUrl(publicId, 50) : null;
  const pictureSources = usePictureElement ? getPictureSources(publicId, baseOptions) : null;

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

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

  // Picture element for modern format support with responsive images
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
          {/* AVIF sources */}
          {responsiveSources.sources.map((source, index) => (
            <source
              key={`avif-${index}`}
              srcSet={pictureSources.avif.replace('/f_avif,', `/f_avif,w_${source.srcSet.split('w_')[1].split(',')[0]},`)}
              media={source.media}
              type="image/avif"
            />
          ))}

          {/* WebP sources */}
          {responsiveSources.sources.map((source, index) => (
            <source
              key={`webp-${index}`}
              srcSet={pictureSources.webp.replace('/f_webp,', `/f_webp,w_${source.srcSet.split('w_')[1].split(',')[0]},`)}
              media={source.media}
              type="image/webp"
            />
          ))}

          {/* JPEG XL sources (fallback) */}
          {responsiveSources.sources.map((source, index) => (
            <source
              key={`jxl-${index}`}
              srcSet={pictureSources['jpeg-xl'].replace('/f_jxl,', `/f_jxl,w_${source.srcSet.split('w_')[1].split(',')[0]},`)}
              media={source.media}
              type="image/jxl"
            />
          ))}

          {/* Fallback img with responsive srcSet */}
          <img
            src={responsiveSources.src}
            srcSet={responsiveSources.srcSet}
            alt={alt}
            className={cn(
              className,
              isLoaded ? 'opacity-100' : 'opacity-0',
              'transition-opacity duration-300'
            )}
            loading="lazy"
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            {...imgProps}
          />
        </picture>
      </div>
    );
  }

  // Standard responsive img element
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
        src={responsiveSources.src}
        srcSet={responsiveSources.srcSet}
        alt={alt}
        className={cn(
          className,
          isLoaded ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-300'
        )}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        {...imgProps}
      />
    </div>
  );
});

ResponsiveImage.displayName = 'ResponsiveImage';