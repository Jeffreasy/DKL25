import React, { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { trackEvent } from '@/utils/googleAnalytics';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import { cc, cn } from '@/styles/shared';
import { OptimizedImage } from '@/components/common/OptimizedImage';

interface EventImageProps {
  src: string;
  alt: string;
}

const EventImage: React.FC<EventImageProps> = memo(({ src, alt }) => {
  const { trackInteraction } = usePerformanceTracking('EventImage');
  const [imageError, setImageError] = useState(false);

  // Extract Cloudinary public ID from URL
  const getPublicId = (url: string): string => {
    try {
      const urlParts = url.split('/upload/');
      if (urlParts.length === 2) {
        const pathParts = urlParts[1].split('/');
        // Remove version and transformations, keep the public ID
        const publicIdParts = pathParts.filter(part =>
          !part.startsWith('v') &&
          !part.includes('c_') &&
          !part.includes('w_') &&
          !part.includes('h_') &&
          !part.includes('f_') &&
          !part.includes('q_')
        );
        return publicIdParts.join('/');
      }
      return url;
    } catch {
      return url;
    }
  };

  const publicId = getPublicId(src);

  const handleImageLoad = useCallback(() => {
    setImageError(false);
    trackInteraction('image_load_success');
  }, [trackInteraction]);

  const handleImageError = useCallback(() => {
    setImageError(true);
    trackInteraction('image_load_error');
    console.error('Afbeelding kon niet worden geladen');
  }, [trackInteraction]);

  return (
    <motion.div
      className="max-w-[800px] mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.3 }}
    >
      {/* Reserve space to prevent layout shift - 16:9 aspect ratio */}
      <div
        className={`rounded-xl overflow-hidden ${cc.shadow.xl} relative`}
        style={{
          width: '100%',
          height: '0',
          paddingBottom: '56.25%', // 16:9 aspect ratio
          backgroundColor: '#f3f4f6' // Skeleton color
        }}
        aria-hidden="true"
      >
        {imageError ? (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className={cn(cc.text.body, 'mb-2')}>Afbeelding kon niet worden geladen</p>
              <p className={cc.text.small}>Gebruik standaard afbeelding</p>
            </div>
          </div>
        ) : (
          <OptimizedImage
            publicId={publicId}
            options={{
              width: 800,
              height: 450,
              crop: 'fill',
              quality: 'auto',
              format: 'auto'
            }}
            usePictureElement={true}
            lazy={true}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
      </div>
    </motion.div>
  );
});

EventImage.displayName = 'EventImage';

export default EventImage;