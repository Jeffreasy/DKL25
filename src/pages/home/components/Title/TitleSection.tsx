import React, { useEffect, useState } from 'react';
import { Calendar, Users, Medal, Loader2, Share2, Heart } from 'lucide-react';
import type { TitleSectionContent, TitleSectionEmbed, EventDetail } from '@/types/titleSection';
import { getTitleSectionContent, getTitleSectionEmbeds } from '@/services/titleSectionService';
import { InschrijfModal } from '@/components/modals/InschrijfModal';

const iconMap = {
  calendar: Calendar,
  users: Users,
  medal: Medal,
} as const;

const TitleSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [content, setContent] = useState<TitleSectionContent | null>(null);
  const [embeds, setEmbeds] = useState<TitleSectionEmbed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [contentData, embedsData] = await Promise.all([
          getTitleSectionContent(),
          getTitleSectionEmbeds()
        ]);
        
        setContent(contentData);
        setEmbeds(embedsData);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);

      const timeout = setTimeout(() => setIsLoaded(true), 100);

      return () => {
        document.body.removeChild(script);
        clearTimeout(timeout);
      };
    }
  }, [isLoading]);

  const renderEventDetail = (detail: EventDetail, index: number) => {
    const Icon = iconMap[detail.icon];

    return (
      <div 
        key={index}
        className="flex flex-col items-center p-6 bg-gray-50/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white hover:-translate-y-1"
      >
        <div className="text-primary mb-3 transform transition-transform group-hover:scale-110">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">
          {detail.title}
        </h3>
        <p className="text-gray-600 text-center">
          {detail.description}
        </p>
      </div>
    );
  };

  const renderSocialEmbed = (embed: TitleSectionEmbed) => (
    <div 
      key={embed.id} 
      className="relative group w-full max-w-[400px] mx-auto bg-white rounded-lg overflow-hidden shadow-lg"
    >
      {/* Embed container */}
      <div 
        dangerouslySetInnerHTML={{ __html: embed.embed_code }}
        className="w-full"
      />
      
      {/* Overlay button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <a 
          href={embed.post_url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#FF8A1F] text-white font-medium px-6 py-2 rounded-md hover:bg-[#FF8A1F]/90 transition-colors"
        >
          Bekijk op {embed.platform === 'instagram' ? 'Instagram' : 'Facebook'}
        </a>
      </div>

      {/* Social interaction footer */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              6 personen vinden dit leuk
            </span>
          </div>
          <button 
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Deel dit bericht"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!content) return null;

  return (
    <section className={`relative w-full bg-orange-100/95 font-heading overflow-hidden isolate transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Accent Bars */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-primary-light to-primary animate-gradient" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-primary-light to-primary animate-gradient" aria-hidden="true" />

      {/* Side Decorations */}
      <div className="absolute top-0 -left-24 bottom-0 w-[15vw] min-w-[60px] max-w-[200px] bg-gradient-45 from-primary/20 to-primary-light/20 -skew-x-15 -z-10 animate-pulse" aria-hidden="true" />
      <div className="absolute top-0 -right-24 bottom-0 w-[15vw] min-w-[60px] max-w-[200px] bg-gradient-45 from-primary/20 to-primary-light/20 skew-x-15 -z-10 animate-pulse" aria-hidden="true" />

      <div className="max-w-[1000px] mx-auto px-4 py-6 relative">
        {/* Main Content */}
        <div className="flex flex-col gap-4 mb-12 text-center">
          <h2 className="text-[clamp(2rem,5vw,3rem)] leading-tight text-gray-900 font-bold tracking-tight">
            {content.title}
          </h2>
          <p className="text-[clamp(1.5rem,3.5vw,2rem)] leading-snug text-gray-600">
            {content.subtitle}
          </p>
          <p className="text-[clamp(1.5rem,3.5vw,2rem)] leading-snug text-primary font-semibold animate-bounce">
            {content.cta_text}
          </p>
        </div>

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {content.event_details.map(renderEventDetail)}
        </div>

        {/* Call to Action Button */}
        <div className="text-center mb-16">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Schrijf je nu in!
          </button>
        </div>
      </div>

      {/* Divider over volledige breedte */}
      <div className="w-full h-1 bg-gradient-to-r from-primary via-primary-light to-primary" />

      <div className="max-w-[1000px] mx-auto px-4 py-12 relative">
        {/* Social Media Section Title */}
        <div className="flex flex-col gap-4 mb-12 text-center">
          <h2 className="text-[clamp(2rem,5vw,3rem)] leading-tight text-gray-900 font-bold tracking-tight">
            Laatste nieuws
          </h2>
          <p className="text-[clamp(1.5rem,3.5vw,2rem)] leading-snug text-gray-600">
            Bekijk op onze social media
          </p>
        </div>

        {/* Social Media Embeds */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[800px] mx-auto">
          {embeds.map(renderSocialEmbed)}
        </div>

        {/* Modal toevoegen */}
        <InschrijfModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </section>
  );
};

export default TitleSection;