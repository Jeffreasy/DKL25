import React from 'react';

interface TitleSectionProps {
  onInschrijfClick: () => void;
  onDonatieClick: () => void;
}

const TitleSection: React.FC<TitleSectionProps> = ({ onInschrijfClick, onDonatieClick }) => {
  return (
    <section className="relative w-full bg-white py-8 text-center font-['Roboto_Slab'] overflow-hidden isolate">
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
            Doe je met ons mee?
          </h2>
          <p className="text-[clamp(1.5rem,3.5vw,2rem)] leading-snug text-gray-600">
            Samen op weg voor een goed doel.
          </p>
          <p className="text-[clamp(1.5rem,3.5vw,2rem)] leading-snug text-primary font-semibold">
            Loop mee met de Koninklijke Loop!
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={onInschrijfClick}
              className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Inschrijven
            </button>
            <button
              onClick={onDonatieClick}
              className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Doneren
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="mt-6 max-w-[600px] mx-auto p-2.5">
          <img 
            src="https://cdn.prod.website-files.com/65c6896e8519c5d0bae5586f/664e0964fa35c47383d2304a_IMG-20240518-WA0027.jpg"
            alt="Deelnemers van de Koninklijke Loop in actie"
            className="w-full h-auto aspect-video object-cover rounded-lg shadow-lg"
            loading="lazy"
            width="400"
            height="300"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
};

export default TitleSection; 