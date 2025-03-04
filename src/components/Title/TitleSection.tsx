// TitleSection.tsx
import React, { useEffect } from 'react';
import { loadInstagramEmbed } from '@/utils/socialScripts';
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

const TitleSection: React.FC<TitleSectionProps> = ({ onInschrijfClick }) => {
  const { data, socialEmbeds, isLoading, error } = useInitialData();

  useEffect(() => {
    if (socialEmbeds.length > 0) {
      loadInstagramEmbed();
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

  if (isLoading) {
    return (
      <div className="py-16 px-5 bg-white font-heading text-center">
        <div className="animate-pulse-slow">
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 px-5 bg-white font-heading text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const handleRegisterClick = () => {
    trackEvent('title_section', 'register_click', 'register_button');
  };

  return (
    <section 
      className="relative w-full bg-gradient-to-b from-orange-50 to-orange-100 py-12 text-center font-heading overflow-hidden isolate"
      role="region"
      aria-label="Evenement details"
    >
      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-8 sm:py-12 relative z-10">
        <div className="relative rounded-2xl p-4 sm:p-8 backdrop-blur-sm bg-white/90 shadow-lg">
          {/* Main Content */}
          <div className="space-y-10">
            {/* Title & Subtitle */}
            <div className="space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#ff9328] font-sans" style={{...data.styling?.title, fontFamily: "'Montserrat', sans-serif"}}>
                {data.title}
              </h2>
              <p className="text-lg sm:text-xl text-gray-700 font-sans" style={{...data.styling?.subtitle, fontFamily: "'Open Sans', sans-serif"}}>
                {data.subtitle}
              </p>
            </div>


            {/* Image Section */}
            <div className="max-w-[800px] mx-auto my-8">
              <div className="rounded-xl overflow-hidden shadow-lg">
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
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 max-w-5xl mx-auto">
              {data.event_details.map((detail: EventDetail, index: number) => (
                <EventDetailCard 
                  key={index} 
                  {...detail} 
                  titleStyle={{fontFamily: "'Montserrat', sans-serif"}}
                  textStyle={{fontFamily: "'Open Sans', sans-serif"}}
                />
              ))}
            </div>

            {/* CTA Button */}
            <div className="mt-10 sm:mt-12">
              <button
                onClick={handleRegisterClick}
                className="bg-[#ff9328] hover:bg-[#e87f1c] text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-3 mx-auto"
                style={{fontFamily: "'Montserrat', sans-serif"}}
                aria-label="Schrijf je nu in voor De Koninklijke Loop"
              >
                <span>{data.cta_text}</span>
                <ArrowForwardIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="relative mt-8 mb-8 w-full h-[3px] bg-gradient-to-r from-[#ff9328] to-[#ffb56e]" />

      {/* Social Media Section */}
      <SocialMediaSection socialEmbeds={socialEmbeds} />
    </section>
  );
};

export default TitleSection;
