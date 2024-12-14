import React, { useState, useEffect } from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { supabase } from '@/lib/supabaseClient';
import type { Database } from '@/types/supabase';
import { loadInstagramEmbed } from '@/utils/socialScripts';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

type TitleSectionRow = Database['public']['Tables']['title_sections']['Row'];
type SocialEmbedRow = Database['public']['Tables']['social_embeds']['Row'];

interface EventDetail {
  icon: string;
  title: string;
  description: string;
}

const iconMap = {
  calendar: <CalendarTodayIcon sx={{ fontSize: 40 }} />,
  users: <PeopleIcon sx={{ fontSize: 40 }} />,
  medal: <EmojiEventsIcon sx={{ fontSize: 40 }} />
};

const EventDetailCard: React.FC<EventDetail> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-300">
    <div className="flex flex-col items-center text-center gap-3">
      <div className="text-primary mb-2">
        {iconMap[icon as keyof typeof iconMap]}
      </div>
      <h3 className="text-gray-900 font-semibold text-base">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

interface TitleSectionProps {
  onInschrijfClick: () => void;
}

const TitleSection: React.FC<TitleSectionProps> = ({ onInschrijfClick }) => {
  const [data, setData] = useState<TitleSectionRow | null>(null);
  const [socialEmbeds, setSocialEmbeds] = useState<SocialEmbedRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [titleResponse, embedsResponse] = await Promise.all([
        supabase.from('title_sections').select('*').single(),
        supabase.from('social_embeds').select('*')
      ]);

      if (titleResponse.error) {
        console.error('Error fetching title section:', titleResponse.error);
      } else {
        setData(titleResponse.data);
      }

      if (embedsResponse.error) {
        console.error('Error fetching social embeds:', embedsResponse.error);
      } else {
        setSocialEmbeds(embedsResponse.data || []);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

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

  if (!data) return null;

  return (
    <section className="relative w-full bg-primary/5 py-8 text-center font-heading overflow-hidden isolate">
      {/* Accent Bars */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-light" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-light" aria-hidden="true" />

      {/* Side Decorations */}
      <div className="absolute top-0 -left-24 bottom-0 w-[15vw] min-w-[60px] max-w-[200px] bg-gradient-45 from-primary/10 to-primary-light/10 -skew-x-15 -z-10" aria-hidden="true" />
      <div className="absolute top-0 -right-24 bottom-0 w-[15vw] min-w-[60px] max-w-[200px] bg-gradient-45 from-primary/10 to-primary-light/10 skew-x-15 -z-10" aria-hidden="true" />

      <div className="max-w-[900px] mx-auto px-4 py-6 relative">
        {/* Circular Decorations */}
        <div className="hidden lg:block absolute top-1/2 -left-[60px] w-[clamp(30px,4vw,40px)] h-[clamp(30px,4vw,40px)] bg-primary/10 rounded-full -translate-y-1/2" aria-hidden="true" />
        <div className="hidden lg:block absolute top-1/2 -right-[60px] w-[clamp(30px,4vw,40px)] h-[clamp(30px,4vw,40px)] bg-primary/10 rounded-full -translate-y-1/2" aria-hidden="true" />

        {/* Content */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-gray-900 font-bold tracking-tight">
            {data.title}
          </h2>
          <p className="text-[clamp(1.5rem,3.5vw,2rem)] leading-snug text-gray-600">
            {data.subtitle}
          </p>
          <p className="text-[clamp(1.5rem,3.5vw,2rem)] leading-snug text-primary font-semibold">
            {data.cta_text}
          </p>
        </div>

        {/* Image */}
        <div className="mt-6 max-w-[600px] mx-auto p-2.5">
          <img 
            src={data.image_url}
            alt="Deelnemers van de Koninklijke Loop in actie"
            className="w-full h-auto aspect-video object-cover rounded-lg shadow-lg"
            loading="lazy"
            width="400"
            height="300"
            decoding="async"
          />
        </div>

        {/* Event Details Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.event_details.map((detail, index) => (
            <EventDetailCard key={index} {...detail} />
          ))}
        </div>

        {/* Inschrijf Button */}
        <div className="mt-12">
          <button
            onClick={onInschrijfClick}
            className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2 mx-auto"
          >
            <span>Schrijf je nu in</span>
            <ArrowForwardIcon />
          </button>
        </div>
      </div>

      {/* Divider - beide margins verkleind */}
      <div className="relative mt-8 mb-8 w-full h-[3px] bg-gradient-to-r from-primary to-primary-light" />

      <div className="max-w-[900px] mx-auto px-4 py-6 relative">
        {/* Social Media Section Title */}
        <div className="mb-8 text-center">
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-gray-900 font-bold tracking-tight mb-2">
            Laatste Nieuws
          </h2>
          <p className="text-[clamp(1.25rem,3vw,1.5rem)] text-gray-600">
            Bekijk op onze social media
          </p>
        </div>

        {/* Social Embeds */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1100px] mx-auto">
          {socialEmbeds.map((embed) => (
            <div 
              key={embed.id}
              className="w-full flex justify-center"
            >
              <div 
                dangerouslySetInnerHTML={{ __html: embed.embed_code }}
                className="w-full max-w-[500px] bg-white rounded-lg shadow-md overflow-hidden"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process(): void;
      };
    };
  }
}

export default TitleSection; 