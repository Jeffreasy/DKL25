import React from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmailIcon from '@mui/icons-material/Email';

interface HeroSectionProps {
  onInschrijfClick: () => void;
  onDonatieClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onInschrijfClick, onDonatieClick }) => {
  return (
    <section 
      className="relative h-[calc(100vh-8rem)] font-heading"
      role="banner"
      aria-label="Hero sectie"
    >
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute inset-0 w-[300%] h-[300%] -translate-x-1/4 -translate-y-1/4">
          <iframe 
            src="https://streamable.com/e/tt6k80?nocontrols=1&autoplay=1&muted=1&loop=1"
            className="w-full h-full object-cover"
            style={{
              transform: 'scale(1.5)',
              transformOrigin: 'center center'
            }}
            allow="autoplay"
            title="Achtergrondvideo"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center pt-8 px-4">
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
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