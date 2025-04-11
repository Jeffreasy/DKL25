// TitleSection.tsx
import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InfoIcon from '@mui/icons-material/Info';
import { useInitialData } from './functions/hooks';
import { TitleSectionRow, EventDetail } from './functions/types';
import EventDetailCard from './components/EventDetailCard';
import SocialMediaSection from './components/SocialMediaSection';
import { trackEvent } from '@/utils/googleAnalytics';

interface TitleSectionProps {
  onInschrijfClick: () => void;
}

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

const TitleSection: React.FC<TitleSectionProps> = ({ onInschrijfClick }) => {
  const { data, socialEmbeds, isLoading, error } = useInitialData();
  const { scrollYProgress } = useScroll();
  
  // Parallax and fade effects
  const titleY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    if (socialEmbeds.length > 0) {
      // loadInstagramEmbed();
    }
  }, [socialEmbeds]);

  useEffect(() => {
    if (!isLoading && !error) {
      trackEvent('title_section', 'section_viewed', 'title_section');
    }
  }, [isLoading, error]);

  // Laad de lettertypen
  useEffect(() => {
    // Voeg de Google Fonts link toe aan de head
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;500;600&display=swap';
    document.head.appendChild(link);

    return () => {
      // Verwijder de link wanneer de component unmount
      document.head.removeChild(link);
    };
  }, []);

  const handleRegisterClick = () => {
    trackEvent('title_section', 'register_click', 'register_button');
    onInschrijfClick();
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <div className="py-16 px-5 bg-white font-heading text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <p className="text-red-600 mb-4">{error}</p>
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
      {isLoading ? (
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
          <TitleSkeleton />
        </div>
      ) : data && (
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
                  className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#ff9328] font-sans leading-tight"
                  style={{fontFamily: "'Montserrat', sans-serif"}}
                >
                  De Koninklijke Loop 2025
                </h1>
                <p 
                  className="text-xl sm:text-2xl text-gray-800 font-sans leading-relaxed max-w-2xl mx-auto"
                  style={{fontFamily: "'Open Sans', sans-serif"}}
                >
                  Op de koninklijke weg kunnen mensen met een beperking samen wandelen met hun verwanten, vrijwilligers of begeleiders
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
                    src="https://res.cloudinary.com/dgfuv7wif/image/upload/v1740778734/Wij_gaan_17_mei_lopen_voor_hen_3_zllxno.png"
                    alt="De Koninklijke Loop promotieafbeelding"
                    className="w-full h-auto"
                    onError={(e) => {
                      console.error('Cloudinary afbeelding kon niet worden geladen, fallback naar placeholder');
                      e.currentTarget.src = 'https://placehold.co/600x400/ff9328/white?text=De+Koninklijke+Loop+2025';
                      e.currentTarget.onerror = null;
                    }}
                  />
                </div>
              </motion.div>

              {/* Event Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 max-w-5xl mx-auto">
                <EventDetailCard 
                  icon="calendar"
                  title="17 mei 2025"
                  description="Start om nog onbekend"
                  index={0}
                  titleStyle={{fontFamily: "'Montserrat', sans-serif"}}
                  textStyle={{fontFamily: "'Open Sans', sans-serif"}}
                />
                <EventDetailCard 
                  icon="users"
                  title="Voor iedereen"
                  description="Alle leeftijden welkom"
                  index={1}
                  titleStyle={{fontFamily: "'Montserrat', sans-serif"}}
                  textStyle={{fontFamily: "'Open Sans', sans-serif"}}
                />
                <EventDetailCard 
                  icon="medal"
                  title="Lopen voor een goed doel"
                  description="Voor verschillende categorieën"
                  index={2}
                  titleStyle={{fontFamily: "'Montserrat', sans-serif"}}
                  textStyle={{fontFamily: "'Open Sans', sans-serif"}}
                />
              </div>

              {/* CTA Button */}
              <motion.div 
                className="mt-12 sm:mt-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  onClick={handleRegisterClick}
                  className="bg-[#ff9328] hover:bg-[#e87f1c] text-white px-10 sm:px-12 py-4 sm:py-5 rounded-full font-bold text-xl tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-4 mx-auto"
                  style={{fontFamily: "'Montserrat', sans-serif"}}
                  aria-label="Schrijf je nu in voor De Koninklijke Loop"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Schrijf je nu in</span>
                  <ArrowForwardIcon sx={{ fontSize: 24 }} />
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
      {!isLoading && data && (
        <SocialMediaSection socialEmbeds={socialEmbeds} />
      )}
    </section>
  );
};

export default React.memo(TitleSection);
