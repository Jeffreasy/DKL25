import React from 'react';
import { trackEvent } from '@/utils/googleAnalytics';

const AboutImage: React.FC = () => {
  const handleImageClick = () => {
    trackEvent('over_ons', 'image_click', 'about_image');
  };

  return (
    <div className="my-12 text-center max-w-4xl mx-auto">
      <div className="relative overflow-hidden rounded-xl mb-6 group">
        <img
          src="https://cdn.prod.website-files.com/65c6896e8519c5d0bae5586f/66c263cb03f03f94f9921898_8c4a504471.jpg"
          alt="Teamleden wandelend"
          className="w-full h-auto block transition-transform duration-300 group-hover:scale-102 cursor-pointer"
          loading="eager"
          onClick={handleImageClick}
        />
      </div>
      <div className="flex flex-col items-center gap-4">
        <p className="text-gray-600 text-lg font-light leading-relaxed max-w-2xl border-b border-gray-200 pb-4">
          <span className="material-icons-round text-primary align-middle mr-1">
            people
          </span>
          Van links naar rechts: Jeffrey | Salih | Peter | Fenny | Michel kon helaas niet bij de fotoshoot aanwezig zijn.
        </p>
        <a
          href="https://beeldpakker.nl/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded"
          aria-label="Bezoek de website van Beeldpakker"
        >
          <img
            src="https://cdn.prod.website-files.com/65c6896e8519c5d0bae5586f/664f48b72335550e9cdfadf8_a7963a8992%20(1).png"
            alt="Beeldpakker - Fotografie"
            className="h-[140px] w-auto opacity-95 transition-opacity group-hover:opacity-100"
            loading="lazy"
          />
          <span className="material-icons-round text-primary opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            launch
          </span>
        </a>
      </div>
    </div>
  );
};

export default AboutImage; 