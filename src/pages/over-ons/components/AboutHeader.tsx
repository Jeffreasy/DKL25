import React from 'react';

const AboutHeader: React.FC = () => {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
        <span className="material-icons-round text-primary align-middle mr-2 text-4xl md:text-5xl">
          groups
        </span>
        Over Ons
      </h1>
      <p className="text-xl text-gray-600 leading-relaxed">
        De Koninklijke Loop wordt georganiseerd door een groep mensen die elkaar allemaal door het werken en leven in zorginstellingen hebben ontmoet.
      </p>
    </div>
  );
};

export default AboutHeader;