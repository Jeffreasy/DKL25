import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import RadioPlayer from './RadioPlayer';
import { trackEvent } from '@/utils/googleAnalytics';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import { cc, cn, colors, animations } from '@/styles/shared';

interface RadioRecording {
  id: string;
  title: string;
  description?: string;
  date?: string;
  audio_url: string;
  thumbnail_url?: string;
  visible: boolean;
  order_number: number;
}

interface RadioGalleryProps {
  title?: string;
  subtitle?: string;
  maxItems?: number;
}

const RadioGallery: React.FC<RadioGalleryProps> = memo(({
  title = "Radio Uitzendingen",
  subtitle = "Luister naar onze radio uitzendingen van voorgaande jaren",
  maxItems = 3
}) => {
  // Performance tracking
  const { trackInteraction, trackPerformanceMetric } = usePerformanceTracking('RadioGallery');

  const [recordings, setRecordings] = useState<RadioRecording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch radio recordings
  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Query recordings from PostgREST API or use fallback data
        let recordingsData;

        try {
          const POSTGREST_URL = import.meta.env.VITE_POSTGREST_URL || '/api';
          console.log('Fetching radio recordings from:', `${POSTGREST_URL}/radio-recordings`);

          const response = await fetch(`${POSTGREST_URL}/radio-recordings`);

          if (!response.ok) {
            console.error('HTTP error:', response.status, response.statusText);
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          recordingsData = data.slice(0, maxItems); // Apply limit client-side
          trackEvent('media_gallery', 'loaded', `count:${data?.length || 0}`);
        } catch (apiError) {
          console.error('API error:', apiError);

          // Fallback to hardcoded data if API fails
          recordingsData = [
            {
              id: '1',
              title: 'DKL Radio Uitzending 2024',
              description: 'Live radio uitzending tijdens de Koninklijke Loop 2024',
              date: '15 mei 2024',
              audio_url: 'https://res.cloudinary.com/dgfuv7wif/video/upload/v1714042357/matinee_1_nbm0ph.wav',
              thumbnail_url: 'https://res.cloudinary.com/dgfuv7wif/image/upload/v1700072275/dkl-radio_qjrp6j.jpg',
              visible: true,
              order_number: 1
            }
          ];

          trackEvent('media_gallery', 'fallback_data_used', 'api_error');
        }
        
        if (!recordingsData || recordingsData.length === 0) {
          throw new Error('Geen radio opnames gevonden');
        }
        
        setRecordings(recordingsData as RadioRecording[]);
      } catch (err) {
        console.error('Error fetching radio recordings:', err);
        setError(err instanceof Error ? err.message : 'Er ging iets mis bij het ophalen van de radio opnames');
        
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, Math.pow(2, retryCount) * 1000);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecordings();
  }, [maxItems, retryCount]);

  // Optimized event handlers
  const handleRetry = useCallback(() => {
    setRetryCount(0);
    trackInteraction('retry_clicked', error || 'unknown_error');
  }, [error, trackInteraction]);

  return (
    <section className={cn(cc.spacing.section, 'px-4 bg-gradient-to-b from-white to-orange-50')}>
      <div className={cn(cc.container.wide)}>
        {/* Section Title */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className={cn(cc.text.h2, 'text-gray-900 mb-4')}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className={cn(cc.typography.lead, 'text-gray-600 max-w-3xl mx-auto')}
            >
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-8">
            {[...Array(2)].map((_, index) => (
              <div key={index} className={cn(animations.pulse, 'bg-white rounded-2xl', cc.shadow.lg, 'overflow-hidden w-full max-w-4xl mx-auto')}>
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-2/5 bg-gray-200 h-[250px]"></div>
                  <div className="w-full md:w-3/5 p-6">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5 mb-6"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-full mb-4"></div>
                    <div className="flex justify-between mb-6">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className={cn('text-center py-10')}>
            <p className={cn(cc.text.error, 'mb-4')}>{error}</p>
            <button
              onClick={handleRetry}
              className={cn(
                cc.button.primary,
                colors.primary.focusRing
              )}
            >
              Opnieuw proberen
            </button>
          </div>
        )}

        {/* Radio Recordings */}
        {!isLoading && !error && (
          <div className="relative">
            {/* Horizontal scroll container */}
            <div className="flex overflow-x-auto pb-6 gap-6 snap-x snap-mandatory scrollbar-hide">
              {recordings.map((recording, index) => (
                <motion.div 
                  key={recording.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex-none w-full sm:w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] snap-center"
                >
                  <RadioPlayer
                    audioUrl={recording.audio_url}
                    title={recording.title}
                    description={recording.description}
                    thumbnailUrl={recording.thumbnail_url}
                    date={recording.date}
                  />
                </motion.div>
              ))}
            </div>
            
            {/* Scroll indicator dots */}
            {recordings.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {recordings.map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-gray-300"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && recordings.length === 0 && (
          <div className={cn('text-center py-10')}>
            <p className={cc.text.muted}>
              Geen radio uitzendingen beschikbaar
            </p>
          </div>
        )}
      </div>
    </section>
  );
});

RadioGallery.displayName = 'RadioGallery';

export default RadioGallery;