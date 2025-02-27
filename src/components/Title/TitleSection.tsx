// TitleSection.tsx
import React, { useEffect } from 'react';
import { loadInstagramEmbed } from '@/utils/socialScripts';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useInitialData } from './functions/hooks';
import { TitleSectionRow, EventDetail } from './functions/types';
import EventDetailCard from './components/EventDetailCard';
import SocialMediaSection from './components/SocialMediaSection';

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

  return (
    <section 
      className="relative w-full bg-gradient-to-b from-[#ff9328]/40 to-[#ff9328]/50 py-8 text-center font-heading overflow-hidden isolate"
      role="region"
      aria-label="Evenement details"
    >
      <div className="max-w-[900px] mx-auto px-8 py-12 relative z-10">
        <div className="relative rounded-2xl p-8">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Title & Subtitle */}
            <div className="space-y-4">
              <h2 className="text-4xl font-bold" style={data.styling?.title}>
                {data.title}
              </h2>
              <p className="text-xl" style={data.styling?.subtitle}>
                {data.subtitle}
              </p>
            </div>

            {/* Video Section */}
            <div className="max-w-[600px] mx-auto">
              <div className="rounded-xl">
                <div className="relative w-full aspect-video rounded-lg shadow-lg overflow-hidden">
                  <iframe
                    src="https://streamable.com/e/opjpma"
                    frameBorder="0"
                    width="100%"
                    height="100%"
                    allowFullScreen
                    allow="autoplay"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    title="De Koninklijke Loop promotievideo"
                  />
                </div>
              </div>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.event_details.map((detail: EventDetail, index: number) => (
                // Als er een uniek id beschikbaar is, vervang index dan door detail.id
                <EventDetailCard key={index} {...detail} />
              ))}
            </div>

            {/* CTA Button */}
            <div>
              <button
                onClick={onInschrijfClick}
                className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-3 mx-auto"
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
      <div className="relative mt-8 mb-8 w-full h-[3px] bg-gradient-to-r from-primary to-primary-light" />

      {/* Social Media Section */}
      <SocialMediaSection socialEmbeds={socialEmbeds} />
    </section>
  );
};

export default TitleSection;
