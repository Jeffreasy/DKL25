import React, { useEffect } from 'react'; 
import { motion } from 'framer-motion';
import BackgroundVideo from '../../../features/video/components/BackgroundVideo';
import { trackEvent } from '@/utils/googleAnalytics';
import { useModal } from '@/contexts/ModalContext';

// Remove HeroSectionProps if no props are needed
// interface HeroSectionProps {}

const HeroSection: React.FC = () => { // No props expected
  const { handleOpenProgramModal } = useModal(); // Get handler from context
  
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

  const handleProgrammaClick = () => {
    console.log("HeroSection: Triggering openProgramModal from context");
    trackEvent('hero', 'program_click', 'programma_tijden_button');
    handleOpenProgramModal('Start/Finish/Feest'); // Call context function
  };

  return (     
    <section
      className="relative h-[calc(100vh-5rem)] font-heading"
      role="banner"
      aria-label="Hero sectie"
    >
      <BackgroundVideo
        // videoUrl="..." // Verwijderd
        webmUrl="https://res.cloudinary.com/dgfuv7wif/video/upload/tt6k80_1_i9orgw.webm" // Expliciete WebM URL
        mp4Url="https://res.cloudinary.com/dgfuv7wif/video/upload/tt6k80_1_i9orgw.mp4"   // Expliciete MP4 URL
        posterUrl="https://res.cloudinary.com/dgfuv7wif/video/upload/tt6k80_1_i9orgw.jpg"
        onPlay={() => trackEvent('hero', 'video_play', 'background_video')}
        onPause={() => trackEvent('hero', 'video_pause', 'background_video')}
        onEnded={() => trackEvent('hero', 'video_end', 'background_video')}
        onError={(error: Error) => trackEvent('hero', 'video_error', error.message)}
      />
      <div className="relative z-10 flex flex-col h-full px-4">
        <div className="w-full max-w-5xl mx-auto pt-16 sm:pt-20 md:pt-24 lg:pt-28 flex justify-center">
          <div className="bg-black/30 backdrop-blur-sm p-4 sm:p-6 rounded-lg text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
              De sponsorloop van mensen met een beperking voor een goed doel!
            </h1>
            <p className="text-white/90 text-lg sm:text-xl mt-3 drop-shadow-md">
              Samen maken we het verschil
            </p>
            <div className="mt-6 bg-primary px-4 py-3 rounded-md text-center max-w-sm mx-auto">
              <div className="mb-2">
                <span className="block font-bold text-base sm:text-lg text-white">De Koninklijke Loop 2025</span>
                <span className="block text-xs sm:text-sm text-white/90">Zaterdag 17 mei 2025</span>
              </div>
              <motion.button 
                onClick={handleProgrammaClick}
                className="mt-1 px-3 py-1.5 bg-white text-primary text-xs sm:text-sm font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Programma/tijden
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  ); 
};  

export default React.memo(HeroSection);