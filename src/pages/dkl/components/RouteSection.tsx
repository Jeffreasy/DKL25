import React from 'react';
import { ContentItem } from './ContentItem';
import { contentItems } from './route.data';
import { trackEvent } from '@/utils/googleAnalytics';

const RouteSection: React.FC = () => {
  React.useEffect(() => {
    trackEvent('dkl', 'section_view', 'route_section');
  }, []);

  return (
    <div className="w-full bg-white font-roboto text-gray-800 antialiased">
      {/* Header Sectie */}
      <div className="relative py-20 px-6 text-center overflow-hidden bg-gradient-to-b from-primary/10 to-transparent">
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="material-icons-round text-8xl md:text-9xl text-primary mb-6 inline-block
            animate-[float_3s_ease-in-out_infinite] hover:scale-110 transition-transform cursor-default">
            directions_walk
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-gray-900 leading-tight">
            De Loop over
            <br />
            De Koninklijke Weg
          </h1>
        </div>
        {/* Decoratieve elementen */}
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent animate-spin-slow" />
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-primary/5 to-transparent animate-spin-slow" style={{ animationDelay: '-5s' }} />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-primary/5 to-transparent animate-spin-slow" style={{ animationDelay: '-10s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-lg md:text-xl text-center text-gray-600 font-light leading-relaxed mb-16 max-w-4xl mx-auto">
          Met Koninklijke Loop wandelen we over een speciaal wandelpad. Het is namelijk het laatste stukje van de Koninklijke Weg. 
          Deze route loopt van Paleis Noordeinde naar Paleis Het Loo, en is bij elkaar 170 kilometer lang. 
          Natuurlijk gaan we dat hele stuk niet op zaterdag 17 mei lopen. Met de Koninklijke Loop wandelen we van Kootwijk naar Paleis Het Loo.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {contentItems.map((item, index) => (
            <ContentItem key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RouteSection; 