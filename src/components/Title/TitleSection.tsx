import React, { useState, useEffect } from 'react';
import { 
  FaHollyBerry, 
  FaSnowflake, 
  FaCandyCane, 
  FaGift, 
  FaBell,
  FaTree,
  FaStar
} from 'react-icons/fa';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { supabase } from '@/lib/supabase';
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
    <section className="relative w-full bg-gradient-to-b from-[#ff9328]/40 to-[#ff9328]/50 py-8 text-center font-heading overflow-hidden isolate">
      {/* Grote centrale kerstboom op de achtergrond */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="relative transform translate-y-[60%]">
          <FaTree className="text-festive-green text-[25rem] opacity-20 animate-pulse-slow" />
          <FaStar className="absolute top-20 left-0 text-festive-gold text-4xl animate-pulse" />
          <FaStar className="absolute top-32 right-0 text-festive-gold text-3xl animate-pulse delay-300" />
          <FaStar className="absolute top-40 left-10 text-festive-gold text-2xl animate-pulse delay-500" />
        </div>
      </div>

      {/* Linker kerstboom onderaan */}
      <div className="absolute bottom-0 left-20 transform -translate-y-20">
        <FaTree className="text-festive-green text-[12rem] opacity-30 animate-pulse-slow" />
      </div>

      {/* Rechter kerstboom onderaan */}
      <div className="absolute bottom-0 right-20 transform -translate-y-20">
        <FaTree className="text-festive-green text-[12rem] opacity-30 animate-pulse-slow" />
      </div>

      {/* Sneeuwvlokken bovenaan */}
      <div className="absolute top-0 left-0 right-0 flex justify-around py-2">
        {[...Array(8)].map((_, i) => (
          <FaSnowflake 
            key={i}
            className={`text-white text-3xl animate-float delay-${(i * 200) % 1000}`}
            style={{ opacity: 0.6 }}
          />
        ))}
      </div>

      {/* Linker decoratie kolom */}
      <div className="absolute left-8 top-20 flex flex-col gap-10 z-10">
        <FaHollyBerry className="text-primary text-5xl animate-float opacity-90" />
        <FaCandyCane className="text-primary text-5xl animate-float delay-200 opacity-90 rotate-45" />
        <FaGift className="text-primary text-5xl animate-float delay-400 opacity-90" />
      </div>

      {/* Rechter decoratie kolom */}
      <div className="absolute right-8 top-20 flex flex-col gap-10 z-10">
        <FaBell className="text-festive-gold text-5xl animate-float opacity-90" />
        <FaGift className="text-primary text-5xl animate-float delay-200 opacity-90" />
        <FaCandyCane className="text-primary text-5xl animate-float delay-400 opacity-90 -rotate-45" />
      </div>

      {/* Content container met feestelijke border */}
      <div className="max-w-[900px] mx-auto px-8 py-12 relative z-10">
        <div className="relative border-4 border-white/20 rounded-2xl p-8 backdrop-blur-sm">
          {/* Content */}
          <div className="flex flex-col gap-4">
            <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-gray-900 font-bold tracking-tight">
              {data.title}
            </h2>
            <p className="text-[clamp(1.5rem,3.5vw,2rem)] leading-snug text-gray-700">
              {data.subtitle}
            </p>
            <p className="text-[clamp(1.5rem,3.5vw,2rem)] leading-snug text-primary font-semibold">
              {data.cta_text}
            </p>
          </div>

          {/* Video met feestelijke border ipv Image */}
          <div className="mt-8 max-w-[600px] mx-auto">
            <div className="p-2 bg-gradient-to-r from-festive-gold/20 to-primary/20 rounded-xl">
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

          {/* Event Details met verbeterde styling */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.event_details.map((detail, index) => (
              <EventDetailCard key={index} {...detail} />
            ))}
          </div>

          {/* Verbeterde Inschrijf Button */}
          <div className="mt-12">
            <button
              onClick={onInschrijfClick}
              className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-3 mx-auto border-2 border-white/20"
            >
              <span>Schrijf je nu in</span>
              <ArrowForwardIcon />
            </button>
          </div>
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