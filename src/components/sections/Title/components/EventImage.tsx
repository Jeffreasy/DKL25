import React, { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { trackEvent } from '@/utils/googleAnalytics';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import { cc } from '@/styles/shared';

interface EventImageProps {
  src: string;
  alt: string;
}

const EventImage: React.FC<EventImageProps> = memo(({ src, alt }) => {
  const { trackInteraction } = usePerformanceTracking('EventImage');
  const [imageError, setImageError] = useState(false);

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
      transition={{ delay: 0.4 }}
    >
      <div className={`rounded-xl overflow-hidden ${cc.shadow.xl} relative aspect-video`}>
        {imageError ? (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="mb-2">Afbeelding kon niet worden geladen</p>
              <p className="text-sm">Gebruik standaard afbeelding</p>
            </div>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="eager"
          />
        )}
      </div>
    </motion.div>
  );
});

EventImage.displayName = 'EventImage';

export default EventImage;