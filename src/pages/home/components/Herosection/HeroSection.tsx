import React from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmailIcon from '@mui/icons-material/Email';
import BackgroundVideo from '../video/BackgroundVideo';

interface HeroSectionProps {
  onInschrijfClick: () => void;
  onDonatieClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onInschrijfClick, onDonatieClick }) => {
  return (
    <section 
      className="relative h-[calc(100vh-5rem)] font-heading"
      role="banner"
      aria-label="Hero sectie"
    >
      <BackgroundVideo 
        posterUrl="https://cdn-cf-east.streamable.com/image/ei5kw8.jpg"
      />
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center h-full px-4 pt-2">
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-2">
          <button
            onClick={onInschrijfClick}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg min-w-[160px]"
          >
            <EmailIcon />
            <span>Inschrijven</span>
          </button>
          <button
            onClick={onDonatieClick}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg min-w-[160px]"
          >
            <FavoriteIcon />
            <span>Doneren</span>
          </button>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center max-w-4xl leading-tight drop-shadow-lg">
          De sponsorloop van mensen met een beperking voor een goed doel!
        </h1>
      </div>
    </section>
  );
};

export default HeroSection; 