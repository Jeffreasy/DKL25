import React, { useEffect } from 'react'; 
import BackgroundVideo from '../video/BackgroundVideo';  
import { trackEvent } from '@/utils/googleAnalytics';

const HeroSection: React.FC = () => {   
  // Track when the hero section becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            trackEvent('hero', 'section_view', 'hero_section');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    const heroSection = document.querySelector('section[role="banner"]');
    if (heroSection) {
      observer.observe(heroSection);
    }

    return () => observer.disconnect();
  }, []);

  return (     
    <section
      className="relative h-[calc(100vh-5rem)] font-heading"
      role="banner"
      aria-label="Hero sectie"
    >
      <BackgroundVideo
        posterUrl="https://cdn-cf-east.streamable.com/image/ei5kw8.jpg"
        onPlay={() => trackEvent('hero', 'video_play', 'background_video')}
        onPause={() => trackEvent('hero', 'video_pause', 'background_video')}
        onEnded={() => trackEvent('hero', 'video_end', 'background_video')}
        onError={(error: Error) => trackEvent('hero', 'video_error', error.message)}
      />
       
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full px-4">
        {/* Title Container with subtle background - centered */}
        <div className="w-full max-w-5xl mx-auto pt-16 sm:pt-20 md:pt-24 lg:pt-28 flex justify-center">
          <div className="bg-black/30 backdrop-blur-sm p-4 sm:p-6 rounded-lg text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
              De sponsorloop van mensen met een beperking voor een goed doel!
            </h1>
            {/* Optional subtitle */}
            <p className="text-white/90 text-lg sm:text-xl mt-3 drop-shadow-md">
              Samen maken we het verschil
            </p>
          </div>
        </div>
      </div>
    </section>
  ); 
};  

export default HeroSection;