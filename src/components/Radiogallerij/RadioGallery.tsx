import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RadioPlayer from './RadioPlayer';
import { supabase } from '@/lib/supabase';
import { trackEvent } from '@/utils/googleAnalytics';

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

const RadioGallery: React.FC<RadioGalleryProps> = ({
  title = "Radio Uitzendingen",
  subtitle = "Luister naar onze radio uitzendingen van voorgaande jaren",
  maxItems = 3
}) => {
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

        // Query recordings from Supabase or use fallback data
        let recordingsData;
        
        try {
          const { data, error } = await supabase
            .from('radio_recordings')
            .select('*')
            .eq('visible', true)
            .order('order_number', { ascending: true })
            .limit(maxItems);
            
          if (error) throw error;
          
          console.log('Fetched recordings:', data); // Debug log
          console.log('Number of recordings:', data?.length); // Debug log
          
          recordingsData = data;
          trackEvent('media_gallery', 'loaded', `count:${data?.length || 0}`);
        } catch (supabaseError) {
          console.error('Supabase error:', supabaseError);
          
          // Fallback to hardcoded data if Supabase fails
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
          
          trackEvent('media_gallery', 'fallback_data_used', 'supabase_error');
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

  // Handle retry when error occurs
  const handleRetry = () => {
    setRetryCount(0);
    trackEvent('media_gallery', 'retry_clicked', error || 'unknown_error');
  };

  return (
    <section className="py-12 sm:py-16 px-4 bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-[1280px] mx-auto">
        {/* Section Title */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-sans"
            style={{fontFamily: "'Montserrat', sans-serif"}}
          >
            {title}
          </h2>
          {subtitle && (
            <p 
              className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-sans"
              style={{fontFamily: "'Open Sans', sans-serif"}}
            >
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-8">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="animate-pulse bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-4xl mx-auto">
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
          <div className="text-center py-10">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-[#ff9328] hover:bg-[#e87f1c] text-white rounded-lg transition-colors"
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
          <div className="text-center py-10">
            <p className="text-gray-600">
              Geen radio uitzendingen beschikbaar
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RadioGallery; 