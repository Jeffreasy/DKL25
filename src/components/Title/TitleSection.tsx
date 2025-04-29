// TitleSection.tsx
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EventNoteIcon from '@mui/icons-material/EventNote';
import InfoIcon from '@mui/icons-material/Info';
import PlaceIcon from '@mui/icons-material/Place';
import { useTitleSectionData } from './functions/useTitleSectionData';
import { TitleSectionData } from './functions/types';
import EventDetailCard from './components/EventDetailCard';
import SocialMediaSection from './components/SocialMediaSection';
import { trackEvent } from '@/utils/googleAnalytics';

interface TitleSectionProps {
  onInschrijfClick: () => void;
  onProgrammaClick: () => void;
}

// --- Countdown Timer Logic ---
const calculateTimeLeft = (targetDate: Date): { days: number; hours: number; minutes: number; seconds: number } | null => {
  const difference = +targetDate - +new Date();
  let timeLeft = null;

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

const targetEventDate = new Date('2025-05-17T09:00:00'); // Set target date and time (e.g., 9 AM)
// --- End Countdown Timer Logic ---

const TitleSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-8">
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="h-12 bg-gray-200 rounded-lg w-3/4 mx-auto" />
      <div className="h-6 bg-gray-200 rounded-lg w-full" />
    </div>
    <div className="max-w-[800px] mx-auto">
      <div className="aspect-video bg-gray-200 rounded-xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-lg h-48" />
      ))}
    </div>
  </div>
);

// Default values for graceful fallback
const DEFAULT_TITLE_DATA: Partial<TitleSectionData> = {
  event_title: 'De Koninklijke Loop (DKL) 2025',
  event_subtitle: 'Het unieke, rolstoelvriendelijke wandelevenement (DKL) in Apeldoorn voor en door mensen met een beperking.',
  image_url: 'https://placehold.co/600x400/ff9328/white?text=De+Koninklijke+Loop+(DKL)+2025',
  image_alt: 'Banner De Koninklijke Loop (DKL) 2025 wandelevenement',
  detail_1_title: 'Datum',
  detail_1_description: '17 mei 2025 (starttijden variëren)',
  detail_2_title: 'Voor Wie?',
  detail_2_description: 'Voor alle wandelaars, met of zonder beperking (rolstoelvriendelijk).',
  detail_3_title: 'Doel',
  detail_3_description: 'Steun het goede doel via dit unieke wandelevenement.',
};

const TitleSection: React.FC<TitleSectionProps> = ({ onInschrijfClick, onProgrammaClick }) => {
  const { titleData, isLoading: isTitleLoading, error: titleError, refetch } = useTitleSectionData();
  const { scrollYProgress } = useScroll();
  
  // Re-added Parallax effects (ensure they are defined before use)
  const titleY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // --- Countdown State and Effect ---
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetEventDate));

  useEffect(() => {
    // Use setInterval for continuous update
    const intervalId = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetEventDate));
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array: run only on mount and unmount

  useEffect(() => {
    // Font loading effect...
  }, []);

  const handleRegisterClick = () => {
    trackEvent('title_section', 'register_click', 'register_button');
    onInschrijfClick();
  };

  const handleProgrammaClick = () => {
    trackEvent('title_section', 'program_click', 'program_button'); 
    onProgrammaClick();
  };

  const handleRetry = () => {
    refetch();
  };

  // Use loaded data or defaults
  const displayData = titleData || DEFAULT_TITLE_DATA;

  if (titleError && !titleData) {
    return (
      <div className="py-16 px-5 bg-white font-heading text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <p className="text-red-600 mb-4">{titleError}</p>
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Opnieuw proberen
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <section 
      className="relative w-full bg-gradient-to-b from-orange-50 to-orange-100 py-12 text-center font-heading overflow-hidden isolate"
      role="region"
      aria-label="Evenement details"
    >
      {isTitleLoading && !titleData ? (
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
          <TitleSkeleton />
        </div>
      ) : (
        <motion.div 
          className="max-w-[1100px] mx-auto px-4 sm:px-8 py-8 sm:py-12 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="relative rounded-2xl p-4 sm:p-8 backdrop-blur-none bg-white shadow-lg"
            style={{ y: titleY, opacity, scale }}
          >
            {/* Main Content */}
            <div className="space-y-12">
              {/* Title & Subtitle */}
              <motion.div 
                className="space-y-6 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#ff9328] font-sans leading-tight"
                  style={{fontFamily: "'Montserrat', sans-serif"}}
                >
                  {displayData.event_title}
                </h1>
                <p 
                  className="text-lg sm:text-xl md:text-2xl text-gray-800 font-sans leading-relaxed max-w-2xl mx-auto"
                  style={{fontFamily: "'Open Sans', sans-serif"}}
                >
                  {displayData.event_subtitle}
                </p>
              </motion.div>

              {/* Image Section */}
              <motion.div 
                className="max-w-[800px] mx-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="rounded-xl overflow-hidden shadow-xl">
                  <img
                    src={displayData.image_url ?? DEFAULT_TITLE_DATA.image_url ?? ''}
                    alt={displayData.image_alt ?? DEFAULT_TITLE_DATA.image_alt ?? 'Event Banner'}
                    className="w-full h-auto"
                    onError={(e) => {
                      console.error('Afbeelding kon niet worden geladen:', e.currentTarget.src);
                      e.currentTarget.src = DEFAULT_TITLE_DATA.image_url!;
                      e.currentTarget.onerror = null;
                    }}
                  />
                </div>
              </motion.div>

              {/* === Participant Counter === */}
              <motion.div
                className="mt-8 mb-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <h3 
                  className="text-lg font-semibold text-gray-800 mb-2"
                  style={{fontFamily: "'Montserrat', sans-serif"}}
                >
                  Aantal Huidige Deelnemers:
                </h3>
                <p 
                  className={`text-4xl font-bold ${(!displayData?.participant_count && displayData?.participant_count !== 0) ? 'text-gray-400' : 'text-primary'}`}
                >
                  {(displayData?.participant_count !== null && displayData?.participant_count !== undefined)
                    ? displayData.participant_count 
                    : '--' // Fallback if null/undefined or not loaded
                  }
                </p>
              </motion.div>
              {/* ========================= */}

              {/* === Countdown Timer === */}
              <motion.div 
                className="mt-10 mb-6 max-w-lg mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {timeLeft ? (
                  <div className="flex justify-center items-center space-x-2 sm:space-x-6 text-center">
                    {Object.entries(timeLeft).map(([unit, value]) => (
                      <div key={unit} className="p-2">
                        <div className="text-3xl sm:text-4xl font-bold text-primary">{String(value).padStart(2, '0')}</div>
                        <div className="text-xs sm:text-sm uppercase text-gray-600 tracking-wider">
                          {unit === 'days' ? 'Dagen' : unit === 'hours' ? 'Uren' : unit === 'minutes' ? 'Minuten' : 'Seconden'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-xl font-semibold text-green-600">
                    Het evenement is begonnen!
                  </div>
                )}
              </motion.div>
              {/* ====================== */}

              {/* Event Details Grid - Adjusted column layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10 max-w-5xl mx-auto">
                <EventDetailCard 
                  icon="calendar"
                  title={displayData.detail_1_title ?? DEFAULT_TITLE_DATA.detail_1_title ?? ''}
                  description={displayData.detail_1_description ?? DEFAULT_TITLE_DATA.detail_1_description ?? ''}
                  index={0}
                  titleStyle={{fontFamily: "'Montserrat', sans-serif"}}
                  textStyle={{fontFamily: "'Open Sans', sans-serif"}}
                />
                <EventDetailCard 
                  icon="users"
                  title={displayData.detail_2_title ?? DEFAULT_TITLE_DATA.detail_2_title ?? ''}
                  description={displayData.detail_2_description ?? DEFAULT_TITLE_DATA.detail_2_description ?? ''}
                  index={1}
                  titleStyle={{fontFamily: "'Montserrat', sans-serif"}}
                  textStyle={{fontFamily: "'Open Sans', sans-serif"}}
                />
                <EventDetailCard 
                  icon="medal"
                  title={displayData.detail_3_title ?? DEFAULT_TITLE_DATA.detail_3_title ?? ''}
                  description={displayData.detail_3_description ?? DEFAULT_TITLE_DATA.detail_3_description ?? ''}
                  index={2}
                  titleStyle={{fontFamily: "'Montserrat', sans-serif"}}
                  textStyle={{fontFamily: "'Open Sans', sans-serif"}}
                />
              </div>

              {/* === ADDED: Start Location Section === */}
              <motion.div
                className="mt-10 mb-8 max-w-md mx-auto p-4 border border-orange-200 rounded-lg bg-white shadow-sm text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <div className="flex flex-col items-center gap-2">
                  <PlaceIcon className="text-primary h-8 w-8" />
                  <h3 className="text-lg font-semibold text-gray-800">Verzamelen Startlocatie</h3>
                  <div className="text-sm text-gray-600 text-left space-y-1">
                    <p><span className="font-medium">15 KM:</span> 10:15 uur</p>
                    <p><span className="font-medium">10 KM:</span> 12:00 uur</p>
                    <p><span className="font-medium">6 KM:</span> 13:15 uur</p>
                    <p><span className="font-medium">2.5 KM:</span> 14:30 uur</p>
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=52.220712953847055,5.954903803533486"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors underline"
                  >
                    Bekijk op Google Maps
                    <ArrowForwardIcon sx={{ fontSize: 16 }} />
                  </a>
                </div>
              </motion.div>
              {/* ==================================== */}

              {/* CTA Buttons Container */}
              <motion.div 
                className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4" 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                {/* Inschrijven Button - Adjusted for mobile */}
                <motion.button
                  onClick={handleRegisterClick}
                  className="bg-[#ff9328] hover:bg-[#e87f1c] text-white px-6 py-3 text-lg sm:px-12 sm:py-5 sm:text-xl rounded-full font-bold tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-4 w-full sm:w-auto"
                  style={{fontFamily: "'Montserrat', sans-serif"}}
                  aria-label="Schrijf je nu in voor De Koninklijke Loop"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Schrijf je nu in</span>
                  <ArrowForwardIcon sx={{ fontSize: { xs: 20, sm: 24 } }} /> {/* Adjusted icon size */}
                </motion.button>

                {/* Programma Button - Adjusted for mobile */}
                <motion.button
                  onClick={handleProgrammaClick}
                  className="bg-white text-primary border border-primary hover:bg-orange-50 px-6 py-3 text-lg sm:px-12 sm:py-5 sm:text-xl rounded-full font-bold tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-4 w-full sm:w-auto"
                  style={{fontFamily: "'Montserrat', sans-serif"}}
                  aria-label="Bekijk het programma"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Bekijk Programma</span>
                  <EventNoteIcon sx={{ fontSize: { xs: 20, sm: 24 } }} /> {/* Adjusted icon size */}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Divider */}
      <motion.div 
        className="relative mt-8 mb-8 w-full h-[3px]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff9328] to-[#ffb56e]" />
      </motion.div>

      {/* Social Media Section */}
      {/* {!isLoadingSocial && socialEmbeds && socialEmbeds.length > 0 && (
        <SocialMediaSection socialEmbeds={socialEmbeds} />
      )} */}
    </section>
  );
};

export default React.memo(TitleSection);
